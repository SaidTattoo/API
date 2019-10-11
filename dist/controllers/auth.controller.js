"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const User_1 = __importDefault(require("../models/User"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
exports.signup = (req, res) => __awaiter(this, void 0, void 0, function* () {
    //guardando un usuario nuevo
    const user = new User_1.default({
        username: req.body.username,
        email: req.body.email,
        password: req.body.password
    });
    user.password = yield user.encryptPassword(user.password);
    const saveUser = yield user.save();
    // token
    const token = jsonwebtoken_1.default.sign({ _id: saveUser._id }, process.env.TOKEN_SECRET || 'tokentest');
    res.header('auth-token', token).json(saveUser);
    res.send('signup');
    console.log(saveUser);
});
exports.signin = (req, res) => __awaiter(this, void 0, void 0, function* () {
    const user = yield User_1.default.findOne({ email: req.body.email });
    if (!user)
        return res.status(400).json({ message: 'email o password esta mal' });
    const correctPassword = yield user.validatePassword(req.body.password);
    if (!correctPassword)
        return res.status(400).json({ message: 'password esta mal' });
    const token = jsonwebtoken_1.default.sign({ _id: user._id }, process.env.TOKEN_SECRET || 'tokentest', {
        expiresIn: 60 * 60 * 24
    });
    res.header('auth-token', token).json(user);
});
exports.profile = (req, res) => __awaiter(this, void 0, void 0, function* () {
    //console.log(req.header('auth-token'))
    const user = yield User_1.default.findById(req.userId, { password: 0 });
    if (!user)
        return res.status(400).json({ message: 'user no exist' });
    res.json(user);
});
//# sourceMappingURL=auth.controller.js.map