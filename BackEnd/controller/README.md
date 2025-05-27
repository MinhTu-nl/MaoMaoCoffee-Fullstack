# Controller Documentation

## User Controller

### Login User Function

The `loginUser` function is an asynchronous function that handles user authentication. Here's a detailed explanation of its functionality:

```javascript
const loginUser = async (req, res) => {
```

- Declares an async function that takes request and response objects as parameters
- `req`: Contains client request information
- `res`: Used to send responses back to the client

```javascript
const { email, password } = req.body;
```
- Extracts email and password from the request body

```javascript
const user = await userModel.findOne({ email })
```
- Searches for a user in the database using the provided email
- Uses `await` as it's an asynchronous database operation

```javascript
if (!user) return res.json({
    success: false,
    message: 'User not found'
})
```
- Checks if user exists
- Returns error response if user is not found

```javascript
const isMatch = await bcrypt.compare(password, user.password)
```
- Compares the provided password with the hashed password in database
- Uses bcrypt for secure password comparison

```javascript
if (isMatch) {
    const token = createToken(user._id)
    res.json({
        success: true,
        token
    })
}
```
- If password matches:
  - Creates a JWT token with user ID
  - Returns success response with token

```javascript
else {
    res.json({
        success: false,
        message: 'Invalid credentials'
    })
}
```
- If password doesn't match:
  - Returns error response with invalid credentials message

```javascript
catch (e) {
    console.log(e)
    res.json({
        success: false,
        message: e.message
    })
}
```
- Handles any errors that occur during execution
- Logs error to console for debugging
- Returns error response with error message

### Features
This function provides basic login functionality with:
- User authentication
- Password encryption
- JWT token generation
- Error handling
- Appropriate response handling

### Dependencies
- jsonwebtoken: For JWT token generation
- bcrypt: For password encryption
- userModel: Database model for user operations
