
const tokens = {
  admin: {
    token: 'admin-token'
  },
  editor: {
    token: 'editor-token'
  }
}
// 模拟路由表
const routerTable = [
  {
    'id': 1,
    'name': 'Example',
    'path': '/example',
    'component': 'Layout',
    'redirect': '/example/table',
    'title': 'Example',
    'icon': 'example',
    'children': [{
      'id': 2,
      'name': 'Table',
      'path': '/example/table',
      'component': 'table',
      'title': 'Table',
      'icon': 'table'
    },
    {
      'id': 3,
      'name': 'Tree',
      'path': '/example/tree',
      'component': 'tree',
      'title': 'Tree',
      'icon': 'tree'
    }]
  },
  {
    'id': 4,
    'path': '/form',
    'component': 'Layout',
    'children': [{
      'id': 5,
      'name': 'Form',
      'path': '/form/index',
      'component': 'form',
      'title': 'Form',
      'icon': 'form'
    }]
  },
  {
    'id': 6,
    'name': 'Nested',
    'path': '/nested',
    'component': 'Layout',
    'redirect': '/nested/menu1/index',
    'title': 'Nested',
    'icon': 'nested',
    'children': [{
      'id': 7,
      'name': 'Menu1',
      'path': '/nested/menu1/index',
      'component': 'menu1',
      'title': 'Menu1',
      'children': [{
        'id': 8,
        'name': 'Menu1-1',
        'path': '/nested/menu1/menu1-1',
        'component': 'menu1-1',
        'title': 'Menu1-1'
      },
      {
        'id': 9,
        'name': 'Menu1-2',
        'path': '/nested/menu1/menu1-2',
        'component': 'menu1-2',
        'title': 'Menu1-2',
        'children': [{
          'id': 10,
          'name': 'Menu1-2-1',
          'path': '/nested/menu1/menu1-2/menu1-2-1',
          'component': 'menu1-2-1',
          'title': 'Menu1-2-1'
        },
        {
          'id': 11,
          'name': 'Menu1-2-2',
          'path': '/nested/menu1/menu1-2/menu1-2-2',
          'component': 'menu1-2-2',
          'title': 'Menu1-2-2'
        }]
      },
      {
        'id': 12,
        'name': 'Menu1-3',
        'path': '/nested/menu1/menu1-3',
        'component': 'menu1-3',
        'title': 'Menu1-3'
      }]
    },
    {
      'id': 13,
      'name': 'Menu2',
      'path': '/nested/menu2/index',
      'component': 'menu2',
      'title': 'Menu2'
    }],
  },
  {
    'id': 14,
    'path': 'external-link',
    'component': 'Layout',
    'children': [{
      'path': 'https://panjiachen.github.io/vue-element-admin-site/#/',
      'title': 'External Link',
      'icon': 'link'
    }]
  }
]
const users = {
  'admin-token': {
    roles: ['admin'],
    introduction: 'I am a super administrator',
    avatar: 'https://wpimg.wallstcn.com/f778738c-e4f8-4870-b634-56703b4acafe.gif',
    name: 'Super Admin',
    routers: routerTable
  },
  'editor-token': {
    roles: ['editor'],
    introduction: 'I am an editor',
    avatar: 'https://wpimg.wallstcn.com/f778738c-e4f8-4870-b634-56703b4acafe.gif',
    name: 'Normal Editor',
    routers: [
      routerTable[0]
    ]
  }
}

export default [
  // user login
  {
    url: '/vue-admin-template/user/login',
    type: 'post',
    response: config => {
      const { username } = config.body
      const token = tokens[username]

      // mock error
      if (!token) {
        return {
          code: 60204,
          message: 'Account and password are incorrect.'
        }
      }

      return {
        code: 20000,
        data: token
      }
    }
  },

  // get user info
  {
    url: '/vue-admin-template/user/info\.*',
    type: 'get',
    response: config => {
      const { token } = config.query
      const info = users[token]

      // mock error
      if (!info) {
        return {
          code: 50008,
          message: 'Login failed, unable to get user details.'
        }
      }

      return {
        code: 20000,
        data: info
      }
    }
  },

  // user logout
  {
    url: '/vue-admin-template/user/logout',
    type: 'post',
    response: _ => {
      return {
        code: 20000,
        data: 'success'
      }
    }
  }
]
