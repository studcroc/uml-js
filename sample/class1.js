class Class1 {

    #privateClass1Property;

    constructor(){
        console.log('Hi from Class1 constructor');
        this.#privateClass1Property = 'Something...';
    }

    get privateClass1Property() {
        return this.#privateClass1Property;
    }

    set privateClass1Property(value) {
        this.#privateClass1Property = value;
    }
}

export default Class1;