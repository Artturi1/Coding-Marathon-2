const jwt = require("jsonwebtoken");
const User = require("../models/userModel");

const createToken = (_id) => {
	return jwt.sign({ _id }, process.env.SECRET, { expiresIn: "3d" });
};

const registerUser = async (req, res) => {
	try {
		const user = await User.signup(req.body);

		const token = createToken(user._id);

		res.status(201).json({
			user: {
				id: user._id,
				name: user.name,
				email: user.email,
				phone_number: user.phone_number,
				gender: user.gender,
				address: user.address,
			},
			token,
		});
	} catch (error) {
		res.status(400).json({ error: error.message });
	}
};

const loginUser = async (req, res) => {
	const { email, password } = req.body;

	try {
		const user = await User.login(email, password);
		const token = createToken(user._id);

		res.status(200).json({
			user: {
				id: user._id,
				name: user.name,
				email: user.email,
				phone_number: user.phone_number,
				gender: user.gender,
				address: user.address,
			},
			token,
		});
	} catch (error) {
		res.status(400).json({ error: error.message });
	}
};

module.exports = {
	registerUser,
	loginUser,
};
