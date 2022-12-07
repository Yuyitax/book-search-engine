// import user model
const { User } = require('../models');
// import sign token function from auth
const { signToken } = require('../utils/auth');
const {AuthenticationError} = require('apollo-server-express') // Built into ApolloServer


const resolvers = {
    Query: {
        me: async(parent, args, context) => {
            if(context.user) {
                const userData = await User.findOne({_id: context.user._id}).select('-__v -password')
                return userData
            }
            throw new AuthenticationError('Not logged in')
        }
    },
    Mutation: {
        addUser: async(parent, args) => {
            const user = await User.create(args)
            const token = signToken(user)
            return {token, user}
        },
        login: async (parent, {email, passsword}) => {
            const user = await User.findOne({email})
            if(!user) {
                throw new AuthenticationError ('Incorrect Credentials')
            }
            const correctPw = await user.isCorrectPassword(password)
            if(!correctPw) {
                throw new AuthenticationError ('Incorrect Credentials')
            }
            const token = signToken(user)
            return { token, user }
        },
        saveBook: async(parent, {bookId}, context)=> {
          if(context.user) {
            const updatedUser = await User.findByIdAndUpdate(
              {_id: context.user._id},
              {$push: { savedBooks: bookData } },
              {new: true}
            )
            return updatedUser
          }
          throw new AuthenticationError ('You are not logged in')
        },
        removeBook: async (parent, {bookId}, context) => {
            if(context.user) {
                const updatedUser = await User.findOneAndUpdate(
                  {_id: context.user._id},
                  {$pull: {savedBooks: { bookId: args.bookId } } },
                  {new: true}
                  )
                  return updatedUser
                }
                throw new AuthenticationError ('A book with that id cannot be found!')
    }
}
};

module.exports = resolvers;