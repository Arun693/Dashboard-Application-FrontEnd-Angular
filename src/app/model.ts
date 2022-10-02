
export class auth {
  ppc!: number;
  password!: string;
}

export class User {
  ppc!: string | number;
  name!: string;
  role!: string;
  isPasswordChanged!: boolean;
  FBU!: number[];
}

export class nameId {
  name!: string;
  id!: string;
}

export class fbu {
  name!: string;
  id!: number;
}

export class docUpload {
  fileName!: string;
  applicationName!: string[] | number[];
  documentName!: string;
  documentType!: string | number;
  documentDate!: string;
}

export class searchDocument {
  current!: string | number;
  pages!: string | number;
  data!: docUpload
}

export class duration {
  fromTime!: string;
  toTime!: string;
}
export class incidentModal {
  application!: string | number;
  durationArray!: duration[]
  fbu!: string;
  issue!: string;
  occurrence!: string;
  rca!: string;
  requestType!: string;
  staffList!: string[]
}
export class documentData {
  fbu!: any;
  documentType! : string;
  documentName! : string;
  documentFromDate! : Date;
  documentToDate! : Date;
  page! : any;
  hashTags! : string[]
}




