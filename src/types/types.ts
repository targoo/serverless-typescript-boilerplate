import { NexusGenEnums } from '../modules/graphql/generated/nexus';

export type Modify<T, R> = Omit<T, keyof R> & R;

export enum BoardStatus {
  ACTIVE = 'ACTIVELYSEEKING',
  ARCHIVED = 'OPENTPOPPORTUNITY',
}

export enum JobStatus {
  STARTED = 'STARTED',
  PHONE_CALL = 'PHONE_CALL',
  FIRST_STAGE_INTERVIEW = 'FIRST_STAGE_INTERVIEW',
  SECOND_STAGE_INTERVIEW = 'SECOND_STAGE_INTERVIEW',
  LAST_STAGE_INTERVIEW = 'LAST_STAGE_INTERVIEW',
  FACE2FACE = 'FACE2FACE',
  TECH_TEST = 'TECH_TEST',
  OFFER = 'OFFER',
  ARCHIVED = 'ARCHIVED',
}

export enum EmploymentType {
  CONTRACT = 'CONTRACT',
  PERMANENT = 'PERMANENT',
}

export enum RemoteOption {
  NO_REMOTE = 'NO_REMOTE',
  FLEXIBLE = 'FLEXIBLE',
  ONEDAY = 'ONEDAY',
  TWODAYS = 'TWODAYS',
  FOURDAYS = 'FOURDAYS',
  FULLY_REMOTE = 'FULLY_REMOTE',
}

export enum EventType {
  FACE2FACE = 'FACE2FACE',
  TECH_TEST = 'TECH_TEST',
  VIDEO_CALL = 'VIDEO_CALL',
  PHONE_CALL = 'PHONE_CALL',
}

export enum Feeling {
  ECSTATIC = 'ECSTATIC',
  HAPPY = 'HAPPY',
  NORMAL = 'NORMAL',
  SAD = 'SAD',
}

export interface IAuth {
  sub: string;
  userId: string;
  nickname: string;
  state: string;
  name: string;
  email: string;
  picture: string;
  email_verified: boolean;
}

export interface IKeyBase {
  id: string;
  relation: string;
}

export interface IEntityBase extends IKeyBase {
  createdAt: Date;
  updatedAt?: Date;
  createdBy?: string;
  isDeleted: boolean;
  readonly uuid: string;
}

export type IEntityBaseDynamo = Modify<
  IEntityBase,
  {
    createdAt: string;
    updatedAt: string;
  }
>;

export interface IBoard extends IEntityBase {
  interestLevel?: NexusGenEnums['InterestLevel'] | null;
  workRightUK?: boolean | null;
  description?: string;
  locationSecondary?: string;
  availableDate?: string;
  title: string;
  locationMain?: string;
  educationLevel?: NexusGenEnums['EducationLevel'] | null;
  location?: string;
  locationCoordinates?: any;
  workRightEU?: boolean | null;
  isOwner?: boolean;
}

export interface IFollowingBoard extends IEntityBase {
  userUuid: string;
  boardUuid: string;
  followingUserUuid: string;
}

export interface IFollowingJob extends IEntityBase {
  userUuid: string;
  boardUuid: string;
  jobUuid: string;
  followingUserUuid: string;
}

export interface IUser extends IEntityBase {
  nickname: string;
  name: string;
  email: string;
  isEmailVerified: boolean;
  state: string;
}

export interface IFile extends IEntityBase {
  resource: string;
  filename: string;
  mimetype: string;
  encoding: string;
}

export interface IJob extends IEntityBase {
  // Agency
  agencyName: string;
  agentName: string;
  agentEmail: string;
  agentPhone: string;
  referralFee: string;
  // Job
  jobTitle: string;
  company: string;
  companyWebsite: string;
  companyLocation: string;
  companyLocationMain: string;
  companyLocationSecondary: string;
  companyLocationCoordinates: any;
  jobDescription: string;
  jobUrl: string;
  // Money
  employmentType: EmploymentType;
  remoteOption: RemoteOption;
  duration: string;
  rate: string;
  ir35: boolean;
  // Extra
  feeling: Feeling;
  status: JobStatus;
}

export interface IEvent extends IEntityBase {
  date: string;
  type: EventType;
}

export enum ICountryISO {
  AFG = 'AFG',
  ALA = 'ALA',
  ALB = 'ALB',
  DZA = 'DZA',
  ASM = 'ASM',
  AND = 'AND',
  AGO = 'AGO',
  AIA = 'AIA',
  ATA = 'ATA',
  ATG = 'ATG',
  ARG = 'ARG',
  ARM = 'ARM',
  ABW = 'ABW',
  AUS = 'AUS',
  AUT = 'AUT',
  AZE = 'AZE',
  BHS = 'BHS',
  BHR = 'BHR',
  BGD = 'BGD',
  BRB = 'BRB',
  BLR = 'BLR',
  BEL = 'BEL',
  BLZ = 'BLZ',
  BEN = 'BEN',
  BMU = 'BMU',
  BTN = 'BTN',
  BOL = 'BOL',
  BES = 'BES',
  BIH = 'BIH',
  BWA = 'BWA',
  BVT = 'BVT',
  BRA = 'BRA',
  IOT = 'IOT',
  BRN = 'BRN',
  BGR = 'BGR',
  BFA = 'BFA',
  BDI = 'BDI',
  CPV = 'CPV',
  KHM = 'KHM',
  CMR = 'CMR',
  CAN = 'CAN',
  CYM = 'CYM',
  CAF = 'CAF',
  TCD = 'TCD',
  CHL = 'CHL',
  CHN = 'CHN',
  CXR = 'CXR',
  CCK = 'CCK',
  COL = 'COL',
  COM = 'COM',
  COG = 'COG',
  COD = 'COD',
  COK = 'COK',
  CRI = 'CRI',
  CIV = 'CIV',
  HRV = 'HRV',
  CUB = 'CUB',
  CUW = 'CUW',
  CYP = 'CYP',
  CZE = 'CZE',
  DNK = 'DNK',
  DJI = 'DJI',
  DMA = 'DMA',
  DOM = 'DOM',
  ECU = 'ECU',
  EGY = 'EGY',
  SLV = 'SLV',
  GNQ = 'GNQ',
  ERI = 'ERI',
  EST = 'EST',
  SWZ = 'SWZ',
  ETH = 'ETH',
  FLK = 'FLK',
  FRO = 'FRO',
  FJI = 'FJI',
  FIN = 'FIN',
  FRA = 'FRA',
  GUF = 'GUF',
  PYF = 'PYF',
  ATF = 'ATF',
  GAB = 'GAB',
  GMB = 'GMB',
  GEO = 'GEO',
  DEU = 'DEU',
  GHA = 'GHA',
  GIB = 'GIB',
  GRC = 'GRC',
  GRL = 'GRL',
  GRD = 'GRD',
  GLP = 'GLP',
  GUM = 'GUM',
  GTM = 'GTM',
  GGY = 'GGY',
  GIN = 'GIN',
  GNB = 'GNB',
  GUY = 'GUY',
  HTI = 'HTI',
  HMD = 'HMD',
  VAT = 'VAT',
  HND = 'HND',
  HKG = 'HKG',
  HUN = 'HUN',
  ISL = 'ISL',
  IND = 'IND',
  IDN = 'IDN',
  IRN = 'IRN',
  IRQ = 'IRQ',
  IRL = 'IRL',
  IMN = 'IMN',
  ISR = 'ISR',
  ITA = 'ITA',
  JAM = 'JAM',
  JPN = 'JPN',
  JEY = 'JEY',
  JOR = 'JOR',
  KAZ = 'KAZ',
  KEN = 'KEN',
  KIR = 'KIR',
  PRK = 'PRK',
  KOR = 'KOR',
  KWT = 'KWT',
  KGZ = 'KGZ',
  LAO = 'LAO',
  LVA = 'LVA',
  LBN = 'LBN',
  LSO = 'LSO',
  LBR = 'LBR',
  LBY = 'LBY',
  LIE = 'LIE',
  LTU = 'LTU',
  LUX = 'LUX',
  MAC = 'MAC',
  MKD = 'MKD',
  MDG = 'MDG',
  MWI = 'MWI',
  MYS = 'MYS',
  MDV = 'MDV',
  MLI = 'MLI',
  MLT = 'MLT',
  MHL = 'MHL',
  MTQ = 'MTQ',
  MRT = 'MRT',
  MUS = 'MUS',
  MYT = 'MYT',
  MEX = 'MEX',
  FSM = 'FSM',
  MDA = 'MDA',
  MCO = 'MCO',
  MNG = 'MNG',
  MNE = 'MNE',
  MSR = 'MSR',
  MAR = 'MAR',
  MOZ = 'MOZ',
  MMR = 'MMR',
  NAM = 'NAM',
  NRU = 'NRU',
  NPL = 'NPL',
  NLD = 'NLD',
  NCL = 'NCL',
  NZL = 'NZL',
  NIC = 'NIC',
  NER = 'NER',
  NGA = 'NGA',
  NIU = 'NIU',
  NFK = 'NFK',
  MNP = 'MNP',
  NOR = 'NOR',
  OMN = 'OMN',
  PAK = 'PAK',
  PLW = 'PLW',
  PSE = 'PSE',
  PAN = 'PAN',
  PNG = 'PNG',
  PRY = 'PRY',
  PER = 'PER',
  PHL = 'PHL',
  PCN = 'PCN',
  POL = 'POL',
  PRT = 'PRT',
  PRI = 'PRI',
  QAT = 'QAT',
  REU = 'REU',
  ROU = 'ROU',
  RUS = 'RUS',
  RWA = 'RWA',
  BLM = 'BLM',
  SHN = 'SHN',
  KNA = 'KNA',
  LCA = 'LCA',
  MAF = 'MAF',
  SPM = 'SPM',
  VCT = 'VCT',
  WSM = 'WSM',
  SMR = 'SMR',
  STP = 'STP',
  SAU = 'SAU',
  SEN = 'SEN',
  SRB = 'SRB',
  SYC = 'SYC',
  SLE = 'SLE',
  SGP = 'SGP',
  SXM = 'SXM',
  SVK = 'SVK',
  SVN = 'SVN',
  SLB = 'SLB',
  SOM = 'SOM',
  ZAF = 'ZAF',
  SGS = 'SGS',
  SSD = 'SSD',
  ESP = 'ESP',
  LKA = 'LKA',
  SDN = 'SDN',
  SUR = 'SUR',
  SJM = 'SJM',
  SWE = 'SWE',
  CHE = 'CHE',
  SYR = 'SYR',
  TWN = 'TWN',
  TJK = 'TJK',
  TZA = 'TZA',
  THA = 'THA',
  TLS = 'TLS',
  TGO = 'TGO',
  TKL = 'TKL',
  TON = 'TON',
  TTO = 'TTO',
  TUN = 'TUN',
  TUR = 'TUR',
  TKM = 'TKM',
  TCA = 'TCA',
  TUV = 'TUV',
  UGA = 'UGA',
  UKR = 'UKR',
  ARE = 'ARE',
  GBR = 'GBR',
  USA = 'USA',
  UMI = 'UMI',
  URY = 'URY',
  UZB = 'UZB',
  VUT = 'VUT',
  VEN = 'VEN',
  VNM = 'VNM',
  VGB = 'VGB',
  VIR = 'VIR',
  WLF = 'WLF',
  ESH = 'ESH',
  YEM = 'YEM',
  ZMB = 'ZMB',
  ZWE = 'ZWE',
}

export enum ICurrencies {
  USD = 'USD',
  GBP = 'GBP',
  CAD = 'CAD',
  EUR = 'EUR',
  BTC = 'BTC',
  AED = 'AED',
  AFN = 'AFN',
  ALL = 'ALL',
  AMD = 'AMD',
  ARS = 'ARS',
  AUD = 'AUD',
  AZN = 'AZN',
  BAM = 'BAM',
  BDT = 'BDT',
  BGN = 'BGN',
  BHD = 'BHD',
  BIF = 'BIF',
  BND = 'BND',
  BOB = 'BOB',
  BRL = 'BRL',
  BWP = 'BWP',
  BYR = 'BYR',
  BZD = 'BZD',
  CDF = 'CDF',
  CHF = 'CHF',
  CLP = 'CLP',
  CNY = 'CNY',
  COP = 'COP',
  CRC = 'CRC',
  CVE = 'CVE',
  CZK = 'CZK',
  DJF = 'DJF',
  DKK = 'DKK',
  DOP = 'DOP',
  DZD = 'DZD',
  EEK = 'EEK',
  EGP = 'EGP',
  ERN = 'ERN',
  ETB = 'ETB',
  GEL = 'GEL',
  GHS = 'GHS',
  GNF = 'GNF',
  GTQ = 'GTQ',
  HKD = 'HKD',
  HNL = 'HNL',
  HRK = 'HRK',
  HUF = 'HUF',
  IDR = 'IDR',
  ILS = 'ILS',
  INR = 'INR',
  IQD = 'IQD',
  IRR = 'IRR',
  ISK = 'ISK',
  JMD = 'JMD',
  JOD = 'JOD',
  JPY = 'JPY',
  KES = 'KES',
  KHR = 'KHR',
  KMF = 'KMF',
  KRW = 'KRW',
  KWD = 'KWD',
  KZT = 'KZT',
  LAK = 'LAK',
  LBP = 'LBP',
  LKR = 'LKR',
  LTL = 'LTL',
  LVL = 'LVL',
  LYD = 'LYD',
  MAD = 'MAD',
  MDL = 'MDL',
  MGA = 'MGA',
  MKD = 'MKD',
  MMK = 'MMK',
  MOP = 'MOP',
  MUR = 'MUR',
  MXN = 'MXN',
  MYR = 'MYR',
  MZN = 'MZN',
  NAD = 'NAD',
  NGN = 'NGN',
  NIO = 'NIO',
  NOK = 'NOK',
  NPR = 'NPR',
  NZD = 'NZD',
  OMR = 'OMR',
  PAB = 'PAB',
  PEN = 'PEN',
  PHP = 'PHP',
  PKR = 'PKR',
  PLN = 'PLN',
  PYG = 'PYG',
  QAR = 'QAR',
  RON = 'RON',
  RSD = 'RSD',
  RUB = 'RUB',
  RWF = 'RWF',
  SAR = 'SAR',
  SDG = 'SDG',
  SEK = 'SEK',
  SGD = 'SGD',
  SOS = 'SOS',
  SYP = 'SYP',
  THB = 'THB',
  TND = 'TND',
  TOP = 'TOP',
  TRY = 'TRY',
  TTD = 'TTD',
  TWD = 'TWD',
  TZS = 'TZS',
  UAH = 'UAH',
  UGX = 'UGX',
  UYU = 'UYU',
  UZS = 'UZS',
  VEF = 'VEF',
  VND = 'VND',
  XAF = 'XAF',
  XOF = 'XOF',
  YER = 'YER',
  ZAR = 'ZAR',
  ZMK = 'ZMK',
}
