package pos.ambrosia.api

import io.ktor.http.*
import io.ktor.serialization.kotlinx.json.*
import io.ktor.server.application.*
import io.ktor.server.auth.*
import io.ktor.server.plugins.contentnegotiation.*
import io.ktor.server.plugins.statuspages.*
import io.ktor.server.request.*
import io.ktor.server.response.*
import io.ktor.server.routing.*
import java.sql.Connection
import pos.ambrosia.db.DatabaseConnection
import pos.ambrosia.models.Payment
import pos.ambrosia.models.TicketPayment
import pos.ambrosia.services.PaymentService
import pos.ambrosia.services.TicketPaymentService

fun Application.configurePayments() {
  val connection: Connection = DatabaseConnection.getConnection()
  val paymentService = PaymentService(connection)
  val ticketPaymentService = TicketPaymentService(connection)
  routing { route("/payments") { payments(paymentService, ticketPaymentService) } }
}

fun Route.payments(paymentService: PaymentService, ticketPaymentService: TicketPaymentService) {
  authenticate("auth-jwt") {
    get("") {
      val payments = paymentService.getPayments()
      if (payments.isEmpty()) {
        call.respond(HttpStatusCode.NoContent, "No payments found")
        return@get
      }
      call.respond(HttpStatusCode.OK, payments)
    }
    get("/{id}") {
      val id = call.parameters["id"]
      if (id == null) {
        call.respond(HttpStatusCode.BadRequest, "Missing or malformed ID")
        return@get
      }

      val payment = paymentService.getPaymentById(id)
      if (payment == null) {
        call.respond(HttpStatusCode.NotFound, "Payment not found")
        return@get
      }

      call.respond(HttpStatusCode.OK, payment)
    }
    post("") {
      val payment = call.receive<Payment>()
      val paymentId = paymentService.addPayment(payment)
      if (paymentId == null) {
        call.respond(HttpStatusCode.BadRequest, "Failed to create payment")
        return@post
      }
      call.respond(HttpStatusCode.Created, mapOf("id" to paymentId, "message" to "Payment added successfully"))
    }
    put("/{id}") {
      val id = call.parameters["id"]
      if (id == null) {
        call.respond(HttpStatusCode.BadRequest, "Missing or malformed ID")
        return@put
      }

      val updatedPayment = call.receive<Payment>().copy(id = id)
      val isUpdated = paymentService.updatePayment(updatedPayment)
      if (!isUpdated) {
        call.respond(HttpStatusCode.NotFound, "Payment with ID: $id not found")
        return@put
      }

      call.respond(HttpStatusCode.OK, mapOf("id" to id, "message" to "Payment updated successfully"))
    }
    delete("/{id}") {
      val id = call.parameters["id"]
      if (id == null) {
        call.respond(HttpStatusCode.BadRequest, "Missing or malformed ID")
        return@delete
      }

      val isDeleted = paymentService.deletePayment(id)
      if (!isDeleted) {
        call.respond(HttpStatusCode.BadRequest, "Failed to delete payment or payment is in use")
        return@delete
      }

      call.respond(HttpStatusCode.OK, mapOf("id" to id, "message" to "Payment deleted successfully"))
    }
    get("/methods") {
      val paymentMethods = paymentService.getPaymentMethods()
      if (paymentMethods.isEmpty()) {
        call.respond(HttpStatusCode.NoContent, "No payment methods found")
        return@get
      }
      call.respond(HttpStatusCode.OK, paymentMethods)
    }
    get("/methods/{id}") {
      val id = call.parameters["id"]
      if (id == null) {
        call.respond(HttpStatusCode.BadRequest, "Missing or malformed ID")
        return@get
      }

      val paymentMethod = paymentService.getPaymentMethodById(id)
      if (paymentMethod == null) {
        call.respond(HttpStatusCode.NotFound, "Payment method not found")
        return@get
      }

      call.respond(HttpStatusCode.OK, paymentMethod)
    }
    get("/currencies") {
      val currencies = paymentService.getCurrencies()
      if (currencies.isEmpty()) {
        call.respond(HttpStatusCode.NoContent, "No currencies found")
        return@get
      }
      call.respond(HttpStatusCode.OK, currencies)
    }
    get("/currencies/{id}") {
      val id = call.parameters["id"]
      if (id == null) {
        call.respond(HttpStatusCode.BadRequest, "Missing or malformed ID")
        return@get
      }

      val currency = paymentService.getCurrencyById(id)
      if (currency == null) {
        call.respond(HttpStatusCode.NotFound, "Currency not found")
        return@get
      }

      call.respond(HttpStatusCode.OK, currency)
    }

    // Ticket Payment endpoints - manage relationships between payments and tickets
    post("/ticket-payments") {
      val ticketPayment = call.receive<TicketPayment>()
      val isAdded = ticketPaymentService.addTicketPayment(ticketPayment)
      if (!isAdded) {
        call.respond(HttpStatusCode.BadRequest, "Failed to create ticket payment relationship")
        return@post
      }
      call.respond(HttpStatusCode.Created, mapOf(
        "paymentId" to ticketPayment.payment_id,
        "ticketId" to ticketPayment.ticket_id,
        "message" to "Ticket payment relationship created successfully"
      ))
    }

    get("/ticket-payments/by-ticket/{ticketId}") {
      val ticketId = call.parameters["ticketId"]
      if (ticketId == null) {
        call.respond(HttpStatusCode.BadRequest, "Missing or malformed ticket ID")
        return@get
      }

      val payments = ticketPaymentService.getTicketPaymentsByTicket(ticketId)
      if (payments.isEmpty()) {
        call.respond(HttpStatusCode.NoContent, "No payments found for this ticket")
        return@get
      }
      call.respond(HttpStatusCode.OK, payments)
    }

    get("/ticket-payments/by-payment/{paymentId}") {
      val paymentId = call.parameters["paymentId"]
      if (paymentId == null) {
        call.respond(HttpStatusCode.BadRequest, "Missing or malformed payment ID")
        return@get
      }

      val tickets = ticketPaymentService.getTicketPaymentsByPayment(paymentId)
      if (tickets.isEmpty()) {
        call.respond(HttpStatusCode.NoContent, "No tickets found for this payment")
        return@get
      }
      call.respond(HttpStatusCode.OK, tickets)
    }

    delete("/ticket-payments") {
      val paymentId = call.request.queryParameters["paymentId"]
      val ticketId = call.request.queryParameters["ticketId"]

      if (paymentId == null || ticketId == null) {
        call.respond(HttpStatusCode.BadRequest, "Missing paymentId or ticketId query parameters")
        return@delete
      }

      val isDeleted = ticketPaymentService.deleteTicketPayment(paymentId, ticketId)
      if (!isDeleted) {
        call.respond(HttpStatusCode.BadRequest, "Failed to delete ticket payment relationship")
        return@delete
      }

      call.respond(HttpStatusCode.OK, mapOf(
        "paymentId" to paymentId,
        "ticketId" to ticketId,
        "message" to "Ticket payment relationship deleted successfully"
      ))
    }

    delete("/ticket-payments/by-ticket/{ticketId}") {
      val ticketId = call.parameters["ticketId"]
      if (ticketId == null) {
        call.respond(HttpStatusCode.BadRequest, "Missing or malformed ticket ID")
        return@delete
      }

      ticketPaymentService.deleteTicketPaymentsByTicket(ticketId)
      call.respond(HttpStatusCode.OK, mapOf("ticketId" to ticketId, "message" to "All payment relationships for ticket deleted"))
    }
  }
}
