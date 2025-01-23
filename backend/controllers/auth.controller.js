import { User } from '../models/User.js'
import bcrypt from 'bcryptjs'
import generateTokenAndSetCookie from '../utils/generateTokenAndSetCookie.js'
import { sendVerificationEmail, sendWelcomeEmail } from '../mailtrap/email.js'


export const signup = async (req,res) => {
    const{email, password, name, position } = req.body
    try {
        if(!email || !password || !name){
            throw new Error("All fields are required")
        }

        const userAlreadyExists = await User.findOne({email})
        if(userAlreadyExists) {
            return res.status(400).json({success:false, message:"User already exist"})
        }
        
        const hashedPassword = await bcrypt.hash(password, 10)
        const verificationToken = Math.floor(100000 + Math.random() * 900000).toString()
        const user = new User({
            email,
            password: hashedPassword,
            name,
            position,
            verificationToken,
            verificationTokenExpiresAt: Date.now() + 24 * 60 * 60 * 1000
        }) 

        generateTokenAndSetCookie(res, user._id)
        sendVerificationEmail(user.email, verificationToken)

        await user.save()

        res.status(201).json({
            success: true,
            message: "User cerated successfully",
            user: {
                ...user._doc,
                password: undefined,
            }
        })

    } catch (error) {
        res.status(400).json({success:false, message: error.message})
    }
}

export const verifyEmail = async (req, res) => {
	const { code } = req.body;
	try {
		const user = await User.findOne({
			verificationToken: code,
			verificationTokenExpiresAt: { $gt: Date.now() },
		});

		if (!user) {
			return res.status(400).json({ success: false, message: "Invalid or expired verification code" });
		}

		user.isVerified = true;
		user.verificationToken = undefined;
		user.verificationTokenExpiresAt = undefined;
		await user.save();

		await sendWelcomeEmail(user.email, user.name);

		res.status(200).json({
			success: true,
			message: "Email verified successfully",
			user: {
				...user._doc,
				password: undefined,
			},
		});
	} catch (error) {
		console.log("error in verifyEmail ", error);
		res.status(500).json({ success: false, message: "Server error" });
	}
};

export const login = async (req,res) => {
    res.send("login route")
}

export const logout = async (req,res) => {
    res.send("logout route")
}