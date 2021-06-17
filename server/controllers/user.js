import nodemailer from 'nodemailer'
import sendgridTransport from 'nodemailer-sendgrid-transport'

import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

import UserModal from "../models/user.js";


const secret = 'test';
// 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

const transporter = nodemailer.createTransport(sendgridTransport({
  auth:{
    api_key: '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'
  }
}))

export const signin = async (req, res) => {
  const { email, password } = req.body;

  try {
    const oldUser = await UserModal.findOne({ email });

    if (!oldUser) return res.status(404).json({ message: "User doesn't exist" });

    const isPasswordCorrect = await bcrypt.compare(password, oldUser.password);

    if (!isPasswordCorrect) return res.status(400).json({ message: "Invalid credentials" });

    const token = jwt.sign({ email: oldUser.email, id: oldUser._id }, secret, { expiresIn: "1h" });

    res.status(200).json({ result: oldUser, token });
  } catch (err) {
    res.status(500).json({ message: "Something went wrong" });
  }
};

export const signup = async (req, res) => {
  const { email, password, firstName, lastName } = req.body;

  try {
    const oldUser = await UserModal.findOne({ email });

    if (oldUser) return res.status(400).json({ message: "User already exists" });

    const hashedPassword = await bcrypt.hash(password, 12);

    const result = await UserModal.create({ email, password: hashedPassword, name: `${firstName} ${lastName}` });

    const token = jwt.sign( { email: result.email, id: result._id }, secret, { expiresIn: "1h" } );

    transporter.sendMail({
      to: result.email,
      from:"monudevada1998@gmail.com",
      subject:"signup success",
      html:"<h1> Welcome to memories</h1>"
    })

    res.status(201).json({ result, token });
  } catch (error) {
    res.status(500).json({ message: "Something went wrong" });
    
    console.log(error);
  }
};