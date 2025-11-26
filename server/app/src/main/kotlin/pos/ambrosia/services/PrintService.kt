package pos.ambrosia.services

import com.github.anastaciocintra.escpos.EscPos
import com.github.anastaciocintra.escpos.EscPosConst
import com.github.anastaciocintra.escpos.Style
import com.github.anastaciocintra.output.PrinterOutputStream
import java.io.IOException
import javax.print.PrintService
import pos.ambrosia.models.TicketData
import pos.ambrosia.models.TicketTemplate
import pos.ambrosia.models.PrinterType
import pos.ambrosia.models.Config


class PrintService(private val ticketTemplateService: TicketTemplateService) {
  private var kitchenPrinter: PrintService? = null
  private var customerPrinter: PrintService? = null
  private var barPrinter: PrintService? = null

  fun getAvailablePrinters(): Array<String> {
    return PrinterOutputStream.getListPrintServicesNames()
  }

  fun setPrinter(type: PrinterType, printerName: String) {
    val printService = PrinterOutputStream.getPrintServiceByName(printerName)
    when (type) {
      PrinterType.KITCHEN -> kitchenPrinter = printService
      PrinterType.CUSTOMER -> customerPrinter = printService
      PrinterType.BAR -> barPrinter = printService
    }
  }

  suspend fun printTicket(
      ticketData: TicketData,
      templateName: String,
      type: PrinterType,
      config: Config?
  ) {
    val printerService =
        when (type) {
          PrinterType.KITCHEN -> kitchenPrinter
          PrinterType.CUSTOMER -> customerPrinter
          PrinterType.BAR -> barPrinter
        }
            ?: throw IOException("Printer for type $type not configured.")

    val template =
        ticketTemplateService.getTemplateByName(templateName)
            ?: throw IOException("Template '$templateName' not found.")

    try {
      val printerOutputStream = PrinterOutputStream(printerService)
      val escpos = EscPos(printerOutputStream)

      val ticketFactory = TicketFactory(template)
      ticketFactory.build(escpos, ticketData, config)

      escpos.feed(5).cut(EscPos.CutMode.FULL)
      escpos.close()
    } catch (e: Exception) {
      throw IOException("Failed to print ticket: ${e.message}", e)
    }
  }
}
