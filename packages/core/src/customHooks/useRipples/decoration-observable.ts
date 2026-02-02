/**
 * @packageDocumentation
 * @module @enr/decoration-observable
 * @file decoration-observable.ts
 * @description 监听者装饰器 「由于决定采用更麻烦的状态管理模式，所以该文件并未被使用」
 * @author MrMudBean <Mr.MudBean@outlook.com>
 * @license MIT
 * @copyright 2026 ©️ MrMudBean
 * @since 2026-01-26 10:01
 * @version 2.0.0-alpha.0
 * @lastModified 2026-01-26 11:09
 */

/**
 * ## 用于订阅模式的监听者装饰器
 * @param target 对象
 * @param key 键
 *
 * @example
 * ```ts
 * // 数据类
 * class DataClass {
 *  private observers: Map<string, Set<() => void>> = new Map();
 *
 *  addObserver(observerKey: keyof this, observerCallback: () => void) {
 *     if(!Object.hasOwn(observerKey) || typeof this[observerKey] === 'function') {
 *        return; // 不符合监听的需求
 *     }
 *     if (this.observers.has(observerKey)) {
 *       const observer = this.observers.get(observerKey);
 *       observer.add(observerCallback);
 *       return
 *     } else {
 *         const observer = new Set();
 *         observer.add(observerCallback);
 *         this.observers.set(observerKey ,observer);
 *     }
 *  }
 *
 *   private notify(field, oldValue, newValue) {
 *      const observer = this.observers.get('field');
 *      if (!observer || !observer.size || !observer.forEach)
 *         return;
 *
 *      observer?.forEach(observerCallback => {
 *         observerCallback(oldValue, newValue)
 *      });
 *   }
 *
 *   \@observable
 *   value = 0;
 *
 *   \@observable
 *   count = 0;
 * }
 *
 * // 消费类
 * class ActionClass {
 *   constructor(private readonly data: DataClass) {
 *      this.log = this.log.bind(this); // 防止 this 丢失
 *      this.data.addObserver('value', this.log);
 *   }
 *
 *   log () {
 *     console.log('总得打印点啥');
 *   }
 * }
 * ```
 */
export function observable(target: any, key: string) {
  const privateField = `_${key}`;
  Object.defineProperty(target, privateField, {
    value: target[key],
    writable: true, // 可写
    enumerable: false, // 不可便利
  });

  Object.defineProperty(target, key, {
    get() {
      return this[privateField];
    },
    set(newValue: any) {
      const oldValue = this[privateField];
      if (oldValue !== newValue) {
        this[privateField] = newValue;
        this._notify?.(key, oldValue, newValue);
      }
    },
    enumerable: true,
    configurable: true,
  });
}
