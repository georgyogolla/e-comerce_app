module.exports = ({ req }) => {
  return `
   <div>
    your id is: ${req.session.userId}
    <form method="POST">
    <input name="email" placeholder="email"/>
    <input name= "password" placeholder="password"/>
    <input name="passwordConfirmation" placeholder="passwordConfirmation"/>
    <button>SIGN UP</button>
    </form>
    </div>
  `
}