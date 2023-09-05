const { default: Class1 } = require("./class1");
const { default: Class2 } = require("./class2");

class Class3 extends Class2 {
    constructor() {
        this.class1Obj = new Class1();
    }

    #class3PrivateMethod() {
        console.log('Hey, this is class3PrivateMethod');
    }
}