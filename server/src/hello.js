 import { ApolloProvider } from 'react-apollo';
    import { ApolloClient } from 'apollo-client';
    import { HttpLink } from 'apollo-link-http';
    import { InMemoryCache } from 'apollo-cache-inmemory';
    import { ApolloLink, split } from 'apollo-client-preset'
    import { WebSocketLink } from 'apollo-link-ws'
    import { getMainDefinition } from 'apollo-utilities'


const wsLink = new WebSocketLink({

  uri: 'wss://subscriptions.graph.cool/v1/cjikbrxfj0mbf0191fg10u8ld',
  options: {
    reconnect: true
  }
})

const httpLink = new HttpLink({ uri: 'https://api.graph.cool/simple/v1/cjikbrxfj0mbf0191fg10u8ld' })

const link = split(

  ({ query }) => {
    const { kind, operation } = getMainDefinition(query)
    return kind === 'OperationDefinition' && operation === 'subscription'
  },
  wsLink,
  httpLink,
)

const client = new ApolloClient({

  link,
  cache: new InMemoryCache()
})

export default async event => {
  // you can use ES7 with async/await and even TypeScript in your functions :)

  await new Promise(r => setTimeout(r, 50))

  return {
    data: {
      message: `Hello ${event.data.name || 'World'}`
    }
  }
}

ReactDOM.render(
	<ApolloProvider client={client}>
	<App />
	</ApolloProvider>,
	document.getElementById('root')
);