package pos.ambrosia.services

import java.sql.Connection
import java.sql.Statement
import pos.ambrosia.logger
import pos.ambrosia.models.User
import pos.ambrosia.utils.SecurePinProcessor

// TODO: Verify AI generated code
class UsersService(private val connection: Connection) {
  companion object {

    private const val ADD_USER =
            """
            INSERT INTO users (id, name, pin, refresh_token, role_id) VALUES (?, ?, ?, ?, ?)
        """

    private const val GET_USERS =
            """
            SELECT u.id, u.name, u.refresh_token, u.pin, r.role 
            FROM users u
            JOIN roles r ON u.role_id = r.id
            WHERE u.is_deleted = 0
        """

    private const val GET_USER_BY_ID =
            """
            SELECT u.id, u.name, u.refresh_token, u.pin, r.role
            FROM users u
            JOIN roles r ON u.role_id = r.id
            WHERE u.id = ? AND u.is_deleted = 0
        """

    private const val UPDATE_USER =
            """
            UPDATE users SET name = ?, pin = ?, refresh_token = ?, role_id = ? WHERE id = ?
        """

    private const val DELETE_USER = "UPDATE users SET is_deleted = 1 WHERE id = ?"

    private const val GET_USER_FOR_AUTH =
            """
            SELECT u.id, u.name, u.pin, r.role
            FROM users u
            JOIN roles r ON u.role_id = r.id
            WHERE u.name = ? AND u.is_deleted = 0
        """
  }

  fun authenticateUser(name: String, pin: CharArray): User? {
    val statement = connection.prepareStatement(GET_USER_FOR_AUTH)
    statement.setString(1, name)
    val resultSet = statement.executeQuery()
    if (resultSet.next()) {
      val userIdString = resultSet.getString("id")
      val storedPinHashBase64 = resultSet.getString("pin")
      logger.info(userIdString)
      val storedPinHash = SecurePinProcessor.base64ToByteArray(storedPinHashBase64)

      val isValidPin = SecurePinProcessor.verifyPin(pin, userIdString, storedPinHash)
      pin.fill('\u0000')

      logger.info(isValidPin.toString())
      if (isValidPin) {
        return User(
                id = userIdString,
                name = resultSet.getString("name"),
                pin = pin.toString(),
                refreshToken = null,
                role = resultSet.getString("role")
        )
      }
    }
    return null
  }

  suspend fun addUser(user: User): String? {
    val statement = connection.prepareStatement(ADD_USER, Statement.RETURN_GENERATED_KEYS)
    // TODO: HASH ID FOR USERS SHA256
    val genereatedId = java.util.UUID.randomUUID().toString()
    statement.setString(1, genereatedId)
    logger.info(genereatedId)
    statement.setString(2, user.name)
    // Encrypt the pin before storing it
    val encryptedPin = SecurePinProcessor.hashPinForStorage(user.pin.toCharArray(), genereatedId)
    statement.setString(3, SecurePinProcessor.byteArrayToBase64(encryptedPin))
    statement.setString(4, user.refreshToken)
    statement.setString(5, user.role)
    statement.executeUpdate()

    val generatedKeys = statement.generatedKeys
    if (generatedKeys.next()) {
      val id = generatedKeys.getString(1)
      return id
    } else {
      return null
    }
  }

  suspend fun getUsers(): List<User> {
    val users = mutableListOf<User>()
    val statement = connection.prepareStatement(GET_USERS)
    val resultSet = statement.executeQuery()
    while (resultSet.next()) {
      val id = resultSet.getString("id")
      val name = resultSet.getString("name")
      val refreshToken = resultSet.getString("refresh_token")
      val role = resultSet.getString("role")
      val pin = resultSet.getString("pin")
      users.add(User(id = id, name = name, pin = pin, refreshToken = refreshToken, role = role))
    }
    return users
  }

  suspend fun getUserById(id: String): User? {
    val statement = connection.prepareStatement(GET_USER_BY_ID)
    statement.setString(1, id)
    val resultSet = statement.executeQuery()
    if (resultSet.next()) {
      val userId = resultSet.getString("id")
      val name = resultSet.getString("name")
      val refreshToken = resultSet.getString("refresh_token")
      val role = resultSet.getString("role")
      val pin = resultSet.getString("pin")
      return User(id = userId, name = name, pin = pin, refreshToken = refreshToken, role = role)
    }
    return null
  }

  suspend fun updateUser(id: String?, updatedUser: User): Boolean {
    if (id == null) return false
    val statement = connection.prepareStatement(UPDATE_USER)
    statement.setString(1, updatedUser.name)

    val encryptedPin = SecurePinProcessor.hashPinForStorage(id.toCharArray(), updatedUser.pin)
    statement.setString(2, SecurePinProcessor.byteArrayToBase64(encryptedPin))
    statement.setString(3, updatedUser.refreshToken)
    statement.setString(4, updatedUser.role)
    statement.setString(5, updatedUser.id)
    val rowsUpdated = statement.executeUpdate()
    return rowsUpdated > 0
  }

  suspend fun deleteUser(id: String): Boolean {
    val statement = connection.prepareStatement(DELETE_USER)
    statement.setString(1, id)
    val rowsDeleted = statement.executeUpdate()
    return rowsDeleted > 0
  }
}
