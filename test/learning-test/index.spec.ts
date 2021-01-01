import { nextTick, reactive, ref, watch } from 'vue'

it('should auto unwrap for deep ref for reactive', () => {
  const refsObject = {
    count: ref(0),
  }
  const reactiveObject = reactive(refsObject)

  refsObject.count.value = 1
  expect(reactiveObject.count).toBe(1)

  reactiveObject.count = 2
  expect(refsObject.count.value).toBe(2)
})

it('should keep reactivity for auto unwrapped ref for reactive', async () => {
  const refsObject = {
    count: ref(0),
  }
  const reactiveObject = reactive(refsObject)

  const handler = jest.fn()
  watch(() => reactiveObject.count, handler)
  refsObject.count.value = 1
  await nextTick()
  expect(handler).toHaveBeenCalled()
  expect(handler.mock.calls[0].slice(0, 2)).toEqual([1, 0])

  const handler2 = jest.fn()
  watch(() => refsObject.count.value, handler2)
  reactiveObject.count = 2
  await nextTick()
  expect(handler2).toHaveBeenCalled()
  expect(handler2.mock.calls[0].slice(0, 2)).toEqual([2, 1])
})

it('should auto unwrap for deep ref for ref', () => {
  const refsObject = {
    count: ref(0),
  }
  const reactiveObject = ref(refsObject)

  refsObject.count.value = 1
  expect(reactiveObject.value.count).toBe(1)

  reactiveObject.value.count = 2
  expect(refsObject.count.value).toBe(2)
})

it('should keep reactivity for auto unwrapped ref for ref', async () => {
  const refsObject = {
    count: ref(0),
  }
  const reactiveObject = ref(refsObject)

  const handler = jest.fn()
  watch(() => reactiveObject.value.count, handler)
  refsObject.count.value = 1
  await nextTick()
  expect(handler).toHaveBeenCalled()
  expect(handler.mock.calls[0].slice(0, 2)).toEqual([1, 0])

  const handler2 = jest.fn()
  watch(() => refsObject.count.value, handler2)
  reactiveObject.value.count = 2
  await nextTick()
  expect(handler2).toHaveBeenCalled()
  expect(handler2.mock.calls[0].slice(0, 2)).toEqual([2, 1])
})

it('should keep reactivity for wrapping reactive object for ref', async () => {
  const reactiveObject = reactive({
    count: 0,
  })
  const refsObject = ref(reactiveObject)

  const handler = jest.fn()
  watch(() => reactiveObject.count, handler)
  refsObject.value.count = 1
  await nextTick()
  expect(handler).toHaveBeenCalled()
  expect(handler.mock.calls[0].slice(0, 2)).toEqual([1, 0])

  const handler2 = jest.fn()
  watch(() => refsObject.value.count, handler2)
  reactiveObject.count = 2
  await nextTick()
  expect(handler2).toHaveBeenCalled()
  expect(handler2.mock.calls[0].slice(0, 2)).toEqual([2, 1])
})
