/**
 * User Controller
 * @class
 */
export default class UserController {
  // Set our passed in User model
  constructor(UserModel) {
    this.User = UserModel;
  }

  /**
   * Retrieves a user by their id.
   * @param {string} id - Id for this user.
   * @returns {object} User.
   */
  async getUserById({ params: { id } }, res) {
    let user;
    try {
      user = await this.User.findOne({ _id: id });
    } catch (error) {
      return res.status(400).json({ success: false, error });
    }

    return res.status(200).json({
      success: true,
      data: user,
    });
  }

  /**
   * Retrieves a user by their email.
   * @param {string} email - Email for this user.
   * @returns {Object} User.
   */
  async getUserByEmail({ params: { email } }, res) {
    let user;
    try {
      user = await this.User.findOne({ email });
    } catch (error) {
      return res.status(400).json({ success: false, error });
    }

    return res.status(200).json({
      success: true,
      data: user,
    });
  }

  /**
   * Updates a user.
   * @param {object} id - Id for this user.
   * @param {Object} updatedUser - Information for this new user.
   */
  async updateUserInfo(id, updatedUser) {
    const filter = { id };

    const update = {
      $set: {
        user: updatedUser,
      },
    };

    await this.User.updateOne(filter, update);
  }
}
