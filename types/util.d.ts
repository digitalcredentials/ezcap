/*!
 * Copyright (c) 2021-2022 Digital Bazaar, Inc. All rights reserved.
 */

/**
 * A signer instance with a sign function and id and controller properties.
 */
export interface Signer {
  id: string;
  controller: string;
  sign(options: {data: Uint8Array}): Promise<Uint8Array>;
}

/**
 * A verification method entry in a DID Document, either as a string ID or
 * an embedded object with an `id` property.
 */
export type VerificationMethodReference = string | {id: string; [key: string]: unknown};

/**
 * A DID Document containing verification relationships for capability
 * invocation and delegation.
 */
export interface DidDocument {
  id: string;
  capabilityInvocation?: VerificationMethodReference[];
  capabilityDelegation?: VerificationMethodReference[];
  [key: string]: unknown;
}

/**
 * A cryptographic key pair with a signer factory method.
 */
export interface KeyPair {
  signer(): Signer;
  [key: string]: unknown;
}

/**
 * A pair of signers derived from a DID Document and key pairs.
 */
export interface CapabilitySigners {
  invocationSigner?: Signer;
  delegationSigner?: Signer;
}

/**
 * Retrieves the first set of capability invocation and delegation signers
 * associated with the `didDocument` from the `keyPairs`.
 */
export declare function getCapabilitySigners(options: {
  didDocument: DidDocument;
  keyPairs: Map<string, KeyPair>;
}): CapabilitySigners;

/**
 * Generates a zcap URI given a root capability URL or a delegated flag.
 * If `url` is provided, returns a root zcap URI for that URL.
 * Otherwise returns a `urn:uuid:` URI.
 */
export declare function generateZcapUri(options?: {url?: string}): Promise<string>;