export default class Course {
    constructor(name, prereqs, coreqs, group) {
        this.name = name;
        this.prereqs = prereqs;
        this.coreqs = coreqs;
        this.group = group
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
    getGroup(){
      return this.group;
    }
  }