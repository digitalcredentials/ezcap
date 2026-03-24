/*!
 * Copyright (c) 2026 Digital Bazaar, Inc. All rights reserved.
 */
import type {DidDocument, KeyPair, Signer} from './util.js';

/**
 * An object that manages connection persistence and reuse for HTTPS requests.
 * @see https://nodejs.org/api/https.html#https_class_https_agent
 */
export type HttpsAgent = object;

/**
 * A class that can be instantiated to create a suite capable of generating a
 * Linked Data Signature. Its constructor must receive a `signer` instance
 * that includes a `.sign()` function and `id` and `controller` properties.
 */
export interface LinkedDataSignatureSuiteClass {
  new(options: {date?: Date; signer: Signer}): object;
  /** Optional suite context document. */
  CONTEXT?: object;
  /** Optional suite context URL. */
  CONTEXT_URL?: string;
}

/**
 * A zcap (Authorization Capability) object.
 */
export interface ZcapObject {
  '@context': string | string[];
  id: string;
  controller?: string;
  invocationTarget: string;
  parentCapability?: string;
  allowedAction?: string | string[];
  expires?: string;
  proof?: object | object[];
  [key: string]: unknown;
}

export interface ZcapClientOptions {
  /** The LD signature suite class to use to sign requests and delegations. */
  SuiteClass: LinkedDataSignatureSuiteClass;
  /**
   * A DID Document that contains `capabilityInvocation` and
   * `capabilityDelegation` verification relationships; `didDocument` and
   * `keyPairs`, or `invocationSigner` and `delegationSigner` must be
   * provided in order to invoke or delegate zcaps, respectively.
   */
  didDocument?: DidDocument;
  /**
   * A map of key pairs associated with `didDocument` indexed by key ID;
   * `didDocument` and `keyPairs`, or `invocationSigner` and
   * `delegationSigner` must be provided in order to invoke or delegate
   * zcaps, respectively.
   */
  keyPairs?: Map<string, KeyPair>;
  /**
   * A signer with `.sign()`, `id`, and `controller` used for delegating zcaps;
   * `delegationSigner` or `didDocument` and `keyPairs` must be provided to
   * delegate zcaps.
   */
  delegationSigner?: Signer;
  /**
   * A signer with `.sign()`, `id`, and `controller` used for signing requests;
   * `invocationSigner` or `didDocument` and `keyPairs` must be provided to
   * invoke zcaps.
   */
  invocationSigner?: Signer;
  /** An optional HttpsAgent to use when performing HTTPS requests. */
  agent?: HttpsAgent;
  /** Optional default HTTP headers to include in every invocation request. */
  defaultHeaders?: Record<string, string>;
  /**
   * Optional document loader to load suite-related contexts. If none is
   * provided, one will be auto-generated if the suite class expresses its
   * required context.
   */
  documentLoader?: (url: string) => Promise<object>;
}

export interface DelegateOptions {
  /**
   * The parent capability to delegate; must be an object if it is a delegated
   * zcap, can be a string if it is a root zcap but then `invocationTarget`
   * must be specified; if not specified, this will be auto-generated as a
   * root zcap for the given `invocationTarget`.
   */
  capability?: string | ZcapObject;
  /** The URL identifying the entity to delegate to. */
  controller: string;
  /**
   * Optional invocation target to use when narrowing a `capability`'s
   * existing invocationTarget. Default is to use
   * `capability.invocationTarget`.
   */
  invocationTarget?: string;
  /**
   * Optional expiration value for the delegation. Default is 5 minutes after
   * `Date.now()`.
   */
  expires?: string | Date;
  /**
   * Optional list of allowed actions or string specifying allowed delegated
   * action. Default: [] - delegate all actions.
   */
  allowedActions?: string | string[];
}

export interface RequestOptions {
  /**
   * The URL to invoke the Authorization Capability against; if not provided,
   * a `capability` must be provided instead.
   */
  url?: string;
  /**
   * The capability to invoke at the given URL. Default: generate root
   * capability from options.url.
   */
  capability?: string | ZcapObject;
  /** The HTTP method to use when accessing the resource. Default: 'GET'. */
  method?: string;
  /** The capability action that is being invoked. Default: same as method. */
  action?: string;
  /** Additional headers to sign and send along with the HTTP request. */
  headers?: Record<string, string>;
  /** The JSON object, if any, to send with the request. */
  json?: object;
  /** A non-JSON body to send with the request (file uploads, PDFs, etc.). */
  body?: Blob | Buffer | Uint8Array;
}

export interface ReadOptions {
  /** The URL to invoke the Authorization Capability against. */
  url: string;
  /** Additional headers to sign and send along with the HTTP request. */
  headers?: Record<string, string>;
  /**
   * The capability to invoke at the given URL. Default: generate root
   * capability from options.url.
   */
  capability?: string | ZcapObject;
}

export interface WriteOptions {
  /** The URL to invoke the Authorization Capability against. */
  url: string;
  /** The JSON object, if any, to send with the request. */
  json?: object;
  /** Additional headers to sign and send along with the HTTP request. */
  headers?: Record<string, string>;
  /**
   * The capability to invoke at the given URL. Default: generate root
   * capability from options.url.
   */
  capability?: string | ZcapObject;
}

export declare class ZcapClient {
  agent?: HttpsAgent;
  defaultHeaders: Record<string, string>;
  SuiteClass: LinkedDataSignatureSuiteClass;
  invocationSigner?: Signer;
  delegationSigner?: Signer;
  documentLoader: (url: string) => Promise<object>;

  /**
   * Creates a new ZcapClient instance that can be used to perform requests
   * against HTTP URLs that are authorized via Authorization Capabilities
   * (ZCAPs).
   */
  constructor(options: ZcapClientOptions);

  /**
   * Delegates an Authorization Capability to a target delegate.
   */
  delegate(options: DelegateOptions): Promise<ZcapObject>;

  /**
   * Performs an HTTP request given an Authorization Capability (zcap) and/or
   * a target URL.
   */
  request(options: RequestOptions): Promise<object>;

  /**
   * Convenience function that invokes an Authorization Capability against a
   * given URL to perform a read operation.
   */
  read(options: ReadOptions): Promise<object>;

  /**
   * Convenience function that invokes an Authorization Capability against a
   * given URL to perform a write operation.
   */
  write(options: WriteOptions): Promise<object>;
}
