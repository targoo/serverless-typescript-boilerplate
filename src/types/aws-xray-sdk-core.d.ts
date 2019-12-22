declare module 'aws-xray-sdk-core' {
  import http = require('http');

  import AWS = require('aws-sdk');
  import AWSClients = require('aws-sdk/clients/all');
  import { Namespace } from 'continuation-local-storage';

  export type AWSClient = InstanceType<typeof AWSClients[keyof typeof AWSClients]>;

  export interface AWSRequestMethod<P, D> {
    (params: P, callback?: Callback<D>): AWS.Request<D, AWS.AWSError>;
    (callback?: Callback<D>): AWS.Request<D, AWS.AWSError>;
  }

  export type Callback<D> = (err: AWS.AWSError | undefined, data: D) => void;

  export namespace plugins {
    interface Plugin {
      getData(callback: (data?: { [key: string]: unknown }) => void): void;
      originName: string;
    }

    /**
     * Exposes the AWS EC2 plugin.
     */
    const EC2Plugin: Plugin;

    /**
     * Exposes the AWS ECS plugin.
     */
    const ECSPlugin: Plugin;

    /**
     * Exposes the AWS Elastic Beanstalk plugin.
     */
    const ElasticBeanstalkPlugin: Plugin;
  }

  /**
   * Enables use of plugins to capture additional data for segments.
   * @param plugins - A configurable subset of AWSXRay.plugins.
   * @see AWSXRay.plugins
   */
  export function config(plugins: plugins.Plugin[]): void;

  export abstract class SegmentLike {
    readonly trace_id?: string;
    readonly id: string;
    readonly name: string;
    readonly in_progress: boolean;
    readonly counter: number;

    fault?: boolean;
    error?: boolean;
    throttle?: boolean;

    addNewSubsegment(name: string): Subsegment;
    addAnnotation(key: string, value: boolean | number | string): void;
    addMetadata(key: string, value: any, namespace?: string): void;
    addError(err?: Error | string, remote?: boolean): void;

    addFaultFlag(): void;
    addErrorFlag(): void;
    addThrottleFlag(): void;

    incrementCounter(additional?: number): void;
    decrementCounter(): void;

    isClosed(): boolean;
    close(err?: Error | string, remote?: boolean): void;
    flush(): void;
  }

  export class Segment extends SegmentLike {
    /**
     * Represents a segment.
     *
     * @param name - The name of the subsegment.
     * @param [rootId] - The trace ID of the spawning parent, included in the 'X-Amzn-Trace-Id' header of
     *                   the incoming request.  If one is not supplied, it will be generated.
     * @param [parentId] - The sub/segment ID of the spawning parent, included in the 'X-Amzn-Trace-Id'
     *                     header of the incoming request.
     */
    constructor(name: string, rootId?: string, parentId?: string);

    readonly trace_id: string;
    notTraced?: boolean;

    readonly http?: middleware.IncomingRequestData;

    addIncomingRequestData(data: middleware.IncomingRequestData): void;
  }

  export class Subsegment extends SegmentLike {
    constructor(name: string);

    segment?: Segment;
    traced?: boolean;

    streamSubsegments(): boolean;
  }

  export type ContextMissingStrategy = 'LOG_ERROR' | 'RUNTIME_ERROR' | ((message: string) => void);

  export function enableAutomaticMode(): void;
  export function enableManualMode(): void;
  export function isAutomaticMode(): boolean;
  export function setStreamingThreshold(threshold: number): void;
  export function setContextMissingStrategy(strategy: ContextMissingStrategy): void;

  export function getSegment(): Segment;
  export function setSegment(segment: SegmentLike): void;
  export function resolveSegment(segment?: SegmentLike): SegmentLike | undefined;
  export function getNamespace(): Namespace;

  export function captureFunc<R>(name: string, fcn: (subsegment: Subsegment) => R, parent?: SegmentLike): R;

  export function captureAsyncFunc<R>(
    name: string,
    fcn: (subsegment: Subsegment) => Promise<R>,
    parent?: SegmentLike,
  ): Promise<R>;

  export function captureCallbackFunc<A extends any[]>(
    name: string,
    fcn: (...args: A) => void,
    parent?: SegmentLike,
  ): (...args: A) => void;

  export function capturePromise(): void;

  export type CapturedAWSClient<C extends AWSClient> = {
    [K in keyof C]: C[K] extends AWSRequestMethod<infer P, infer D>
      ? AWSRequestMethod<P & { XRaySegment?: SegmentLike }, D>
      : C[K];
  };

  export type CapturedAWS<T = typeof AWS> = {
    [K in keyof T]: T[K] extends AWSClient ? CapturedAWSClient<T[K]> : T[K];
  };

  export function captureAWSClient<C extends AWSClient>(client: C): CapturedAWSClient<C>;
  export function captureAWS(awssdk: typeof AWS): CapturedAWS;

  export function captureHTTPs(mod: typeof http): typeof http;
  export function captureHTTPsGlobal(mod: typeof http): void;

  export namespace middleware {
    interface TraceData {
      [key: string]: string;
    }

    function enableDynamicNaming(hostPattern: string): void;
    function processHeaders(req: http.IncomingMessage): TraceData;
    function resolveName(hostHeader?: string): string;
    function resolveSampling(amznTraceHeader: TraceData, segment: Segment, res: http.ServerResponse): void;
    function setDefaultName(name: string): void;

    class IncomingRequestData {
      constructor(req: http.IncomingMessage);
      close(res: http.ServerResponse): void;
    }
  }

  export namespace utils {
    function getCauseTypeFromHttpStatus(status: number | string): 'error' | 'fault' | undefined;

    /**
     * Splits out the data from the trace id format.  Used by the middleware.
     * @param traceData - The additional trace data (typically in req.headers.x-amzn-trace-id).
     * @alias module:mw_utils.processTraceData
     */
    function processTraceData(traceData?: string): middleware.TraceData;
  }
}
