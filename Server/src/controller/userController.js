const userModel = require("../models/userModel");
const jwt = require('jsonwebtoken')
const bcrypt = require("bcrypt")

const isValid = function (value) {
    if (typeof (value) === undefined || typeof (value) === null) { return false }
    if (typeof (value) === "string" && value.trim().length > 0) { return true }
    if (typeof (value) === "number" && value.toString().trim().length > 0) { return true }
    if (typeof (value) === null ) { return false}
}


const isRightFormatemail = function (email) {
    return /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(email);
}


const isRightFormatphone = function (phone) {
    return /^[6-9]\d{9}$/.test(phone);
}

const createUser = async function (req, res) {
    try {
        let data = req.body
        let { name, phone, email, password, Cpassword } = data;
        if (Object.keys(data) == 0) { return res.status(400).send({ status: false, message: 'No data provided' }) }

        if (!isValid(name)) { return res.status(400).send({ status: false, message: 'Name is required' }) }

        if (!isValid(phone)) { return res.status(400).send({ status: false, message: 'Phone Number is required' }) }

        if (!isRightFormatphone(phone)) { return res.status(400).send({ status: false, message: 'Please provide a valid phone number' }) }

        if (!isValid(email)) { return res.status(400).send({ status: false, message: 'Email is required' }) }

        if (!isRightFormatemail(email)) { return res.status(400).send({ status: false, message: 'Please provide a valid email' }) }

        let isUniqueemail = await userModel.findOne({ email: email })
        if (isUniqueemail) { return res.status(400).send({ status: false, message: 'Email Id already exist' }) }

        if (!isValid(password)) { return res.status(400).send({ status: false, message: 'Password is required' }) }

        if (password.length < 8 || password.length > 15) { return res.status(400).send({ status: false, message: 'Password should be of minimum 8 characters & maximum 15 characters' }) }
        
        if (!isValid(Cpassword)) { return res.status(400).send({ status: false, message: 'Please confirm your password' }) }

       if (Cpassword !== password){return res.status(400).send({status:false, message:"Passwords don't match"})}

       const saltRounds = 10;
       const hash = await bcrypt.hash(password,saltRounds);
       data.password = hash;
       data.Cpassword = hash;

    const newUser = await userModel.create(data);
    return res.status(201).send({ status: true, message: 'User successfully created'})

    }
    catch (error) {
        console.log(error)
        return res.status(500).send({ message: error.message })
    }
}


const login = async function (req, res) {
    try {
        const mail = req.body.email
        const pass = req.body.password
        
        if (!isValid(mail)) { return res.status(400).send({ status: false, message: "Email is required" }) }

        if (!isRightFormatemail(mail)) { return res.status(400).send({ status: false, message: 'Please provide a valid email' }) }

        if (!isValid(pass)) { return res.status(400).send({ status: false, message: "Password is required" }) }

        const mailMatch = await userModel.findOne({ email: mail })
        if (!mailMatch) return res.status(401).send({ status: false, message: "Email is incorrect" })

        const password = mailMatch.password;

        const passMatch = await bcrypt.compare(pass, password)
        if (!passMatch) return res.status(401).send({ status: false, message: "Password is incorrect" })

        const token = jwt.sign({
            userId: mailMatch._id.toString(), iat: new Date().getTime() / 1000,
        }, "Secret-Key", { expiresIn: "30m" });

        res.setHeader("x-api-key", "token");
        return res.status(200).send({ status: true, message: "You are successfully logged in"})

    }
    catch (error) {
        console.log(error)
        return res.status(500).send({ message: error.message })
    }
}


module.exports = {createUser , login};