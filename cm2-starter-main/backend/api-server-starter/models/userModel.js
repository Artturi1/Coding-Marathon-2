const mongoose = require("mongoose");
const validator = require("validator");
const bcrypt = require("bcryptjs");

const { Schema } = mongoose;

const userSchema = new Schema(
	{
		name: { type: String, required: true }, // Full name of the user
		email: { type: String, required: true, unique: true }, // Unique username for login
		password: { type: String, required: true }, // Hashed password for authentication
		phone_number: { type: String, required: true }, // Contact phone number
		gender: { type: String, required: true }, // Gender of the user
		address: {
			street: { type: String, required: true }, // Street address
			city: { type: String, required: true }, // City
			zipCode: { type: String, required: true }, // Postal/ZIP code
		},
	},
	{ timestamps: true, versionKey: false }
);

userSchema.statics.signup = async function (payload) {
	const {
		name,
		email,
		password,
		phone_number,
		gender,
		address,
	} = payload;

	if (!name || !email || !password || !phone_number || !gender) {
		throw Error("All fields are required");
	}

	if (!address || !address.street || !address.city || !address.zipCode) {
		throw Error("Address fields are required");
	}

	if (!validator.isEmail(email)) {
		throw Error("Email is not valid");
	}

	const exists = await this.findOne({ email });
	if (exists) {
		throw Error("Email already in use");
	}

	const salt = await bcrypt.genSalt(10);
	const hash = await bcrypt.hash(password, salt);

	const user = await this.create({
		name,
		email,
		password: hash,
		phone_number,
		gender,
		address,
	});

	return user;
};

userSchema.statics.login = async function (email, password) {
	if (!email || !password) {
		throw Error("Email and password are required");
	}

	const user = await this.findOne({ email });
	if (!user) {
		throw Error("Incorrect email or password");
	}

	const match = await bcrypt.compare(password, user.password);
	if (!match) {
		throw Error("Incorrect email or password");
	}

	return user;
};

module.exports = mongoose.model("User", userSchema);
