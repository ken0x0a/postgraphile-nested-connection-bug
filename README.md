## Reproduce


```graphql

mutation createUser {
  createUser(input: {
    user: {
      username:"yey"
      name: "u"
    }
  }) {
    user {
      id
      name
      username
    }
  }
}
mutation updateUser {
  updateUser(
    input: {
      nodeId: "WyJ1c2VycyIsMV0="
      patch: {
        name: "this"
      }
    }
  ) {
    user {
      name
    }
  }
}
query User {
  usersList {
    username
    nodeId
  }
}

```