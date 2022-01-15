class Course {
    constructor(name, prereqs, coreqs) {
        this.name = name;
        this.prereqs = prereqs;
        this.coreqs = coreqs;
    }
    getPrereqs() {
        return this.prereqs;
    }
    getCoreqs() {
        return this.coreqs;
    }
    getName(){
        return this.name;
    }
  }