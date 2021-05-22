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
   * @param {string} id - Id for this user
   * @returns {object} New user.
   */
  async getUserById(req, res) {
    const {
      params: { id },
    } = req;

    let user;
    try {
      user = await this.User.findOne({ id });
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
   * @param {string} email - Email for this user
   * @returns {object} user.
   */
  async getUserByEmail(req, res) {
    const {
      params: { email },
    } = req;

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
   * @param {object} id - Id for this user
   * @param {object} newUser - Information for this new user
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
