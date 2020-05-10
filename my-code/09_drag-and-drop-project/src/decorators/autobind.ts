// autobind decorator
export function autobind(_target: any, _methodName: string, descriptor: PropertyDescriptor) {
  const originalMethod = descriptor.value;
  const adjDesriptor: PropertyDescriptor = {
    configurable: true,
    
    get() : string {
      const boundFn = originalMethod.bind(this); 
      return boundFn;
    }
  };
  return adjDesriptor;
}