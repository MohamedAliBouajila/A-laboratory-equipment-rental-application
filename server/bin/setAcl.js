module.exports = {
setSessionAcl:(user)=>{
  const sessionACL = new Parse.ACL();
  sessionACL.setReadAccess(id, true)
  sessionACL.setWriteAccess(id, true)
  return session.setACL(sessionACL);
},
setUserAcl:(user)=>{
  const userACL = new Parse.ACL();
  userACL.setPublicReadAccess(false);
  userACL.setPublicWriteAccess(false);
  userACL.setRoleReadAccess("laboworker", true);
  userACL.setRoleWriteAccess("admin", true);
  userACL.setRoleReadAccess("admin", true);
  return user.setACL(userACL);
},
setRentAcl:(rent,id)=>{
  const rentACL = new Parse.ACL();
  rentACL.setPublicReadAccess(false);
  rentACL.setPublicWriteAccess(false);
  rentACL.setReadAccess(id, true)
  rentACL.setWriteAccess(id, true)
  rentACL.setRoleWriteAccess("laboworker", true);
  rentACL.setRoleReadAccess("laboworker", true);
  rentACL.setRoleWriteAccess("admin", true);
  rentACL.setRoleReadAccess("admin", true);
  return rent.setACL(rentACL);
},
setItemAcl:(item)=>{
  const itemACL = new Parse.ACL();
  itemACL.setPublicReadAccess(false);
  itemACL.setPublicReadAccess(false);
  itemACL.setRoleReadAccess("user", true);
  itemACL.setRoleWriteAccess("laboworker", true);
  itemACL.setRoleReadAccess("laboworker", true);
  return item.setACL(itemACL);
}
}