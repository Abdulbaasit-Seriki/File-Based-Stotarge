const signInTemplate = ({ req }) => {
	return 
	`
	   <div>
	    Current User ID = ${req.session.userId}
	      <form method="POST">
	        <input name="email" placeholder="email" />
	        <input name="password" placeholder="password" />
	        <button>Sign In</button>
	      </form>
	    </div>
  `
}

module.exports = signInTemplate;