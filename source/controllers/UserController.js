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
    try {
      const user = await this.User.findOne({ _id: req.params.id });

      res.status(200).json(user);

    } catch (error) {
      res.status(400).json({ success: false, error });
    }
  }

  /**
   * Retrieves a user by their email.
   * @param {string} email - Email for this user
   * @returns {object} user.
   */
  async getUserByEmail(req, res) {
    try {
      const user = await this.User.findOne({ email: req.params.email });

      res.status(200).json(user);

    } catch (error) {
      res.status(400).json({ success: false, error });
    }
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
