/**
 *
 * This file is auto-generated. Do not edit manually: changes may be erased.
 * Generated by Aqua compiler: https://github.com/fluencelabs/aqua/. 
 * If you find any bugs, please write an issue on GitHub: https://github.com/fluencelabs/aqua/issues
 * Aqua version: 0.3.1-231
 *
 */
import { Fluence, FluencePeer } from '@fluencelabs/fluence';
import {
    ResultCodes,
    RequestFlow,
    RequestFlowBuilder,
    CallParams,
} from '@fluencelabs/fluence/dist/internal/compilerSupport/v1';


function missingFields(obj: any, fields: string[]): string[] {
    return fields.filter(f => !(f in obj))
}

// Services

export interface GreetingDef {
    greeting: (auth: boolean, did: string, callParams: CallParams<'auth' | 'did'>) => string;
}

export function registerGreeting(serviceId: string, service: GreetingDef): void;
export function registerGreeting(peer: FluencePeer, serviceId: string, service: GreetingDef): void;
export function registerGreeting(...args: any) {
    let peer: FluencePeer;
    let serviceId: any;
    let service: any;
    if (FluencePeer.isInstance(args[0])) {
        peer = args[0];
    } else {
        peer = Fluence.getPeer();
    }

    if (typeof args[0] === 'string') {
        serviceId = args[0];
    } else if (typeof args[1] === 'string') {
        serviceId = args[1];
    } 

    // Figuring out which overload is the service.
    // If the first argument is not Fluence Peer and it is an object, then it can only be the service def
    // If the first argument is peer, we are checking further. The second argument might either be
    // an object, that it must be the service object
    // or a string, which is the service id. In that case the service is the third argument
    if (!(FluencePeer.isInstance(args[0])) && typeof args[0] === 'object') {
        service = args[0];
    } else if (typeof args[1] === 'object') {
        service = args[1];
    } else {
        service = args[2];
    }

    const incorrectServiceDefinitions = missingFields(service, ['greeting']);
    if (!!incorrectServiceDefinitions.length) {
        throw new Error("Error registering service Greeting: missing functions: " + incorrectServiceDefinitions.map((d) => "'" + d + "'").join(", "))
    }

    peer.internals.callServiceHandler.use((req, resp, next) => {
        if (req.serviceId !== serviceId) {
            next();
            return;
        }

        if (req.fnName === 'greeting') {
            const callParams = {
                ...req.particleContext,
                tetraplets: {
                    auth: req.tetraplets[0],did: req.tetraplets[1]
                },
            };
            resp.retCode = ResultCodes.success;
            resp.result = service.greeting(req.args[0], req.args[1], callParams)
        }

        next();
    });
}
      


export interface AuthServiceDef {
    auth: (did: string, callParams: CallParams<'did'>) => boolean;
}

export function registerAuthService(serviceId: string, service: AuthServiceDef): void;
export function registerAuthService(peer: FluencePeer, serviceId: string, service: AuthServiceDef): void;
export function registerAuthService(...args: any) {
    let peer: FluencePeer;
    let serviceId: any;
    let service: any;
    if (FluencePeer.isInstance(args[0])) {
        peer = args[0];
    } else {
        peer = Fluence.getPeer();
    }

    if (typeof args[0] === 'string') {
        serviceId = args[0];
    } else if (typeof args[1] === 'string') {
        serviceId = args[1];
    } 

    // Figuring out which overload is the service.
    // If the first argument is not Fluence Peer and it is an object, then it can only be the service def
    // If the first argument is peer, we are checking further. The second argument might either be
    // an object, that it must be the service object
    // or a string, which is the service id. In that case the service is the third argument
    if (!(FluencePeer.isInstance(args[0])) && typeof args[0] === 'object') {
        service = args[0];
    } else if (typeof args[1] === 'object') {
        service = args[1];
    } else {
        service = args[2];
    }

    const incorrectServiceDefinitions = missingFields(service, ['auth']);
    if (!!incorrectServiceDefinitions.length) {
        throw new Error("Error registering service AuthService: missing functions: " + incorrectServiceDefinitions.map((d) => "'" + d + "'").join(", "))
    }

    peer.internals.callServiceHandler.use((req, resp, next) => {
        if (req.serviceId !== serviceId) {
            next();
            return;
        }

        if (req.fnName === 'auth') {
            const callParams = {
                ...req.particleContext,
                tetraplets: {
                    did: req.tetraplets[0]
                },
            };
            resp.retCode = ResultCodes.success;
            resp.result = service.auth(req.args[0], callParams)
        }

        next();
    });
}
      
// Functions

export function greeting(did: string, ns_tuples: { node_id: string; service_id: string }[], config?: {ttl?: number}) : Promise<string>;
export function greeting(peer: FluencePeer, did: string, ns_tuples: { node_id: string; service_id: string }[], config?: {ttl?: number}) : Promise<string>;
export function greeting(...args: any) {
    let peer: FluencePeer;
    let did: any;
    let ns_tuples: any;
    let config: any;
    if (FluencePeer.isInstance(args[0])) {
        peer = args[0];
        did = args[1];
        ns_tuples = args[2];
        config = args[3];
    } else {
        peer = Fluence.getPeer();
        did = args[0];
        ns_tuples = args[1];
        config = args[2];
    }

    let request: RequestFlow;
    const promise = new Promise<string>((resolve, reject) => {
        const r = new RequestFlowBuilder()
                .disableInjections()
                .withRawScript(`
                    (xor
                     (seq
                      (seq
                       (seq
                        (seq
                         (seq
                          (seq
                           (seq
                            (call %init_peer_id% ("getDataSrv" "-relay-") [] -relay-)
                            (call %init_peer_id% ("getDataSrv" "did") [] did)
                           )
                           (call %init_peer_id% ("getDataSrv" "ns_tuples") [] ns_tuples)
                          )
                          (call -relay- ("op" "noop") [])
                         )
                         (xor
                          (seq
                           (call -relay- ("op" "noop") [])
                           (call ns_tuples.$.[0].node_id! (ns_tuples.$.[0].service_id! "auth") [did] is_auth)
                          )
                          (seq
                           (seq
                            (call -relay- ("op" "noop") [])
                            (call %init_peer_id% ("errorHandlingSrv" "error") [%last_error% 1])
                           )
                           (call -relay- ("op" "noop") [])
                          )
                         )
                        )
                        (xor
                         (call ns_tuples.$.[1].node_id! (ns_tuples.$.[1].service_id! "greeting") [is_auth did] res)
                         (seq
                          (call -relay- ("op" "noop") [])
                          (call %init_peer_id% ("errorHandlingSrv" "error") [%last_error% 2])
                         )
                        )
                       )
                       (call -relay- ("op" "noop") [])
                      )
                      (xor
                       (call %init_peer_id% ("callbackSrv" "response") [res])
                       (call %init_peer_id% ("errorHandlingSrv" "error") [%last_error% 3])
                      )
                     )
                     (call %init_peer_id% ("errorHandlingSrv" "error") [%last_error% 4])
                    )
                `,
                )
                .configHandler((h) => {
                    h.on('getDataSrv', '-relay-', () => {
                        return peer.getStatus().relayPeerId;
                    });
                    h.on('getDataSrv', 'did', () => {return did;});
                    h.on('getDataSrv', 'ns_tuples', () => {return ns_tuples;});
                    h.onEvent('callbackSrv', 'response', (args) => {
                        const [res] = args;
                        resolve(res);
                    });
                    h.onEvent('errorHandlingSrv', 'error', (args) => {
                        const [err] = args;
                        reject(err);
                    });
                })
                .handleScriptError(reject)
                .handleTimeout(() => {
                    reject('Request timed out for greeting');
                })

                if (config && config.ttl) {
                    r.withTTL(config.ttl)
                }

                request = r.build();
    });
    peer.internals.initiateFlow(request!);
    return promise;
}