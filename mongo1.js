const { model1, model2 } = require('./mongo.js');
const bcrypt=require('bcrypt');
async function finddata(eid2, pass2) {
    try {
        console.log("eid2",eid2);
        const user = await model1.find({ eid1: eid2 });
        console.log(user,"user data");
        if (user) {
            console.log(user, "user called");
            console.log(pass2,user[0].pass1)
            // Do not log passwords for security reasons
            console.log("Data found in finddata");

            // Compare the provided password with the hashed password in the database
            const isPasswordMatch = await bcrypt.compare(pass2, user[0].pass1);

            if (isPasswordMatch) {
                console.log("Password matched");
                return {
                    get:()=>{
                        return true
                    }
                };
              
            } else {
                console.log("Password did not match");
                return false;
            }
        } else {
            console.log("Not Found!");
            return false;
        }
    } catch (err) {
        console.log("error message");
        console.error(err);
        return false;
    }
}
async function submitQuote(post, color) {
    try {
        const date1 = new Date().toJSON().slice(0, 10).split('-').reverse().join('/')
        const subquote = new model2({
            post,
            color,
            date: date1
        });

        const x = await subquote.save();
        console.log(x);
    } catch (error) {
        console.error(error);
    }
}
async function getdata() {
    const data = await model2.find();
    return data;
}
module.exports = {
    finddata,
    submitQuote,
    getdata
}

