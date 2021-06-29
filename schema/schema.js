const graphql = require('graphql')
const _ = require('lodash')
const Author = require('../models/author.model')
const Book = require('../models/book.model')

const {
  GraphQLObjectType,
  GraphQLString,
  GraphQLInt,
  GraphQLID,
  GraphQLList,
  GraphQLSchema,
  GraphQLNonNull
} = graphql


const BookType = new GraphQLObjectType({
  name: 'Book',
  fields: () => ({
    id: {type: GraphQLID},
    title: {type: GraphQLString},
    genre: {type: GraphQLString},
    author: {
      type: AuthorType,
      resolve(parent, args) {
        return Author.findById(parent.authorId)
      }
    }
  })
})

const AuthorType = new GraphQLObjectType({
  name: 'Author',
  fields: () => ({
    id: {type: GraphQLID},
    name: {type: GraphQLString},
    age: {type: GraphQLInt},
    books: {
      type: new GraphQLList(BookType),
      resolve(parent, args) {
        return Book.find({authorId: parent.id})
      }
    }
  })
})

const RootQuery = new GraphQLObjectType({
  name: 'RootQueryType',
  fields: {
    book: {
      type: BookType,
      args: {id: {type: new GraphQLNonNull(GraphQLID)}},
      resolve(parent, args) {
        // Database here
        return Book.findById(args.id)
      }
    },
    author: {
      type: AuthorType,
      args: {id: {type: new GraphQLNonNull(GraphQLID)}},
      resolve(parent, args) {
        return Author.findById(args.id)
      }
    },
    books: {
      type: new GraphQLList(BookType),
      resolve(parent, args) {
        return Book.find({})
      }
    },
    authors: {
      type: new GraphQLList(AuthorType),
      resolve(parent, args) {
        return Author.find({})
      }
    }
  }
})

const Mutation = new GraphQLObjectType({
  name: 'Mutation',
  fields: {
    addAuthor: {
      type: AuthorType,
      args: {
        name: {type: new GraphQLNonNull(GraphQLString)},
        age: {type: new GraphQLNonNull(GraphQLInt)}
      },
      resolve(parent, args) {
        let newAuthor = new Author({
          name: args.name,
          age: args.age
        })

        return newAuthor.save()
      }
    },
    addBook: {
      type: BookType,
      args: {
        title: {type: new GraphQLNonNull(GraphQLString)},
        genre: {type: new GraphQLNonNull(GraphQLString)},
        authorId: {type: GraphQLID}
      },
      resolve(parent, args) {
        let newBook = new Book({
          title: args.title,
          genre: args.genre,
          authorId: args.authorId
        })

        return newBook.save()
      }
    },
    deleteAuthor: {
      type: AuthorType,
      args: {
        id: {type: new GraphQLNonNull(GraphQLID)}
      },
      resolve(parent, args) {
        return Author.findByIdAndDelete(args.id)
      }
    },
    deleteBook: {
      type: BookType,
      args: {
        id: {type: new GraphQLNonNull(GraphQLID)}
      },
      resolve(parent, args) {
        return Book.findByIdAndDelete(args.id)
      }
    },
    updateAuthor: {
      type: AuthorType,
      args: {
        id: {type: new GraphQLNonNull(GraphQLID)},
        newName: {type: GraphQLString},
        newAge: {type: GraphQLInt}
      },
      resolve(parent, args) {
        let updatedAuthor = {}
        if(args.newName) updatedAuthor.name = args.newName
        if(args.newAge) updatedAuthor.age = args.newAge

        return Author.findByIdAndUpdate(
          args.id,
          { $set: updatedAuthor }
        )
      }
    }
  }
})

module.exports = new GraphQLSchema({
  query: RootQuery,
  mutation: Mutation
})
