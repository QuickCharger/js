// �ж��Ƿ����ĳ������
if(typeof a === "undefined") {
	console.log("a undefined")
} else {
	console.log("a defined")
}

// Ĭ��ֵ��д������ͨ����
let r1 = typeof a !== "undefined" ? a : "3000"
console.log("result = " + r1)

// Ĭ��ֵ��д�������Ա
obj={}
let r2 = obj.a || '3000'
console.log("result = " + r2)

//�ڴ�����ڣ�ʹ��let������������֮ǰ���ñ������ǲ����õ�
let tmp = 123;
if (true) {
  // tmp = 'abc';   // ReferenceError
  let tmp;
}

{
  let [a,b,c] = [1,2,3]
  console.log(a + " " + b + " " + c)
}

async����ʵ�ʷ���Promise
	������ص��Ƿ�PromiseҲ��ͨ��Promise.resolve()��װ��Promise
	�����return���Զ�����Promise.resolve(undefined)
	����������صľ���Promise ����ǰ�治�ü�async
Promise�еĺ���������ִ��
awaitִ�в���
	1. ִ��await����ı��ʽ
	2. ����await���ӵ����ߴ�����ִ��
	3. Promiseִ����resolve�� ��await������ִ��
