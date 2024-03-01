export enum apiRoutes {
  LOGIN = '/login',
  SIGNUP = '/signup',
  SIGNOUT = '/auth/signout',
  FETCH_ME = '/users/me',
  REFRESH_TOKENS = '/auth/refresh',
  UPLOAD_AVATAR_IMAGE = '/users/upload',

  UPDATE_USER = '/users/',

  FETCH_BIDS = '/bids/auction/',
  PLACE_BID = '/bids',

  PLACE_AUCTION = '/auctions',
  UPDATE_AUCTION = '/auctions/',
  DELETE_AUCTION = '/auctions/',

  FETCH_ALLAUCTIONS = '/auctions',
  FETCH_MYAUCTIONS = '/auctions/my-auctions',
  FETCH_BIDDING = '/auctions/bidding',
  FETCH_WON = 'auctions/won',
  FETCH_AUCTIONDETAIL = 'auctions/',
  GET_AVATAR_IMAGE = '/users/get/image',
  PRODUCTS_PREFIX = '/products',
  ROLES_PREFIX = '/roles',
  ORDERS_PREFIX = '/orders',
  PERMISSIONS_PREFIX = '/permissions',
}
