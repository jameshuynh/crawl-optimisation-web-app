// public/scripts/app.js

let Router = ReactRouter.Router;
let Route = ReactRouter.Route;
let Redirect = ReactRouter.Redirect;
let backendURL = 'http://seo-backend.jameshuynh.com';
let browserHistory = ReactRouter.browserHistory;

class App extends React.Component {
  render() {
    return (
      <div className='app'>
        { this.props.children }
      </div>
    );
  }
}

class UsersIndex extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      allUsers: null
    };
  }

  componentWillMount() {
    superagent
      .get(backendURL + '/users')
      .end((err, res) => {
        if(!err) {
          this.setState({ allUsers: res.body });
        }//end if
      });
  }

  render() {
    if(this.state.allUsers) {
      let users = this.state.allUsers.map((user) => {
        return (
          <tr key={ user.id }>
            <td>{ user.id }</td>
            <td>{ user.name }</td>
            <td>{ user.title }</td>
            <td><a href={`/users/${user.id}`}>View</a></td>
          </tr>
        );
      });

      return (
        <table>
          <thead>
            <tr>
              <th>ID</th>
              <th>Name</th>
              <th>Title</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            { users }
          </tbody>
        </table>
      );
    } else {
      return (
        <div>Loading...</div>
      );
    }
  }
}

class UserDetail extends React.Component {
  constructor(props) {
    super(props);
    this.state = { user: null };
  }

  componentWillMount() {
    superagent
      .get(backendURL + '/users/' + this.props.params.userId)
      .end((err, res) => {
        if(!err) {
          this.setState({ user: res.body });
        }
      });
  }

  render() {
    if(this.state.user) {
      let user = this.state.user;
      return (
        <div>
          <ul>
            <li>ID: {user.id}</li>
            <li>Name: {user.name}</li>
            <li>Title: {user.title}</li>
            <li>Bio: {user.bio}</li>
          </ul>
          <a href='/users'>Back</a>
        </div>
      );
    } else {
      return (<div>Loading...</div>);
    }
  }
}

ReactDOM.render((
  <Router history={browserHistory}>
    <Redirect from='/' to='/users' />
    <Route path="/" component={App}>
      <Route path="/" component={UsersIndex}/>
      <Route path="/users" component={UsersIndex}/>
      <Route path="/users/:userId" component={UserDetail} />
    </Route>
  </Router>
), document.getElementById('root'));
