
export const endpoints = {
  authenticate: "user/authenticate",
  documentTypes: "common/getDocumentTypes",
  incidentSearch: "incident/getIncidents",
  incidentsInExcel: "incident/downloadAsExcel",
  deleteIncident : "incident/deleteIncident",
  applicationNames: "common/getApplicationNames",
  singleUpload: "document/upload",
  singleBlobUpload: "document/uploadBlob",
  documentUploadEntry: "document/saveDocDetails",
  documentSearch: "document/searchDocument",
  documentDownload: "document/download",
  secureDownload: "document/downloadBlob",
  documentDelete: "document/deleteDocument",
  secureDocumentDelete: "document/deleteBlobDocument",
  changeCredential: "user/changePassword",
  addNewUser: "user/addUser",
  getAllUsers: "user/getallUsers",
  getUserForKeyword: "user/getUsersForKeyword",
  getFBUUsers: "user/getFBUusers",
  getSIngleUser: "user/getOneUser",
  deleteUser: "user/delete",
  editUser: "user/editSingle",
  resetPassword: "user/passwordReset",
  getCounts: "common/getCounts",
  getChannelNames: "common/getchannelTypes",
  saveServerInfo: "serverInfo/saveServerInfo",
  getServerInfo: "serverInfo/getServerInfo",
  getServerForIP: "serverInfo/searchServerIP",
  getHashTags: "hashtags/getHashTags",
  saveIncident: "incident/saveIncident",
  logout: "common/logout"
};

export const adminPages = [
  {
    "id": 1,
    "name": "Documents",
    "count": '',
    "class": "fa fa-database",
    "children": [{
      "name": "Add Document",
      "state": "/addDocument"
    }, {
      "name": "View Document",
      "state": "/searchDocument"
    }]
  }, {
    "id": 2,
    "name": "Users",
    "count": '',
    "class": "fa fa-users",
    "children": [{
      "name": "Add User",
      "state": "/addUser"
    }, {
      "name": "Edit User",
      "state": "/editUser"
    }]
  }, {
    "id": 3,
    "name": "Server Details",
    "class": "fa fa-server",
    "children": [{
      "name": "Add Server Info",
      "state": "/addServer"
    },
    {
      "name": "View Server Info",
      "state": "/viewServer"
    }]
  }, {
    "id": 4,
    "name": "Incidents",
    "class": "fa fa-wrench",
    "children": [{
      "name": "Add Incident",
      "state": "/addIncident"
    },
    {
      "name": "View Incident",
      "state": "/trackIncident"
    }]
  }];

export const userPages = [{
  "name": "Documents",
  "id": 1,
  "count": '',
  "class": "fa fa-database",
  "children": [{
    "name": "Add Document",
    "state": "/addDocument"
  }, {
    "name": "View Document",
    "state": "/searchDocument"
  }]
},
{
  "id": 2,
  "name": "Server Details",
  "class": "fa fa-server",
  "children": [
  {
    "name": "View Server Info",
    "state": "/viewServer"
  }]
}, {
  "id": 3,
  "name": "Incidents",
  "class": "fa fa-wrench",
  "children": [{
    "name": "Add Incident",
    "state": "/addIncident"
  },
  {
    "name": "View Incident",
    "state": "/trackIncident"
  }]
}];

export const allowedDocTypes = ['application/pdf', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.template', 'application/msword', 'application/vnd.ms-excel',
  'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet', 'application/vnd.ms-powerpoint', 'image/x-png', 'image/jpeg', 'image/x-citrix-jpeg', 'image/png', 'text/plain'];

export const maxFileSize = 1024 * 1024 * 5;

export const incidentTypes = [
  {
    "name": "Planned Downtime",
    "id": 1
  },
  {
    "name": "Incident",
    "id": 2
  },
  {
    "name": "Feature Rollout",
    "id": 3
  }
];

export const occurrence = [
  {
    "name": "Once",
    "id": 1
  },
  {
    "name": "Multiple",
    "id": 2
  }
]