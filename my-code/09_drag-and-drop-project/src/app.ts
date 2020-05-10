// Project Type
enum ProjectStatus {
  Active,
  Finished
}

class Project {
  constructor(
    public id: string,
    public title: string,
    public description: string,
    public people: number,
    public status: ProjectStatus
  ) {}
}

type ProjectListener<T> = (projectList: T[]) => void;


// Project State Management
class State<T> {
  protected listeners: ProjectListener<T>[] = [];
  
  addListener(listenerFn: ProjectListener<T>) {
    this.listeners.push(listenerFn);
  }
}

class ProjectState extends State<Project> {
  private static instance: ProjectState;
  
  static getInstance() {
    if (this.instance) {
      return this.instance;
    }
    this.instance = new ProjectState();
    return this.instance;
  }

  private projects: Project[] = [];

  private constructor() { 
    super();
  }

  addProject(title: string, description: string, numberPeople: number) {
    const newProject = new Project(Math.random().toString(), title, description, numberPeople, ProjectStatus.Active);

    this.projects.push(newProject);
    this.listeners.forEach(fn => {
      fn(this.projects.slice());
    });
  }
}

const projectState = ProjectState.getInstance();


// validation
interface Validatable {
  value: string | number;
  required?: boolean;
  minLength?: number;
  maxLength?: number;
  min?: number;
  max?: number;
}

function validate(validatableInput: Validatable) {
  let isValid = true;

  if (validatableInput.required) {
    isValid = isValid && validatableInput.value.toString().trim().length !== 0;
  }
  if (validatableInput.minLength != null && typeof validatableInput.value === 'string') {
    isValid = isValid && validatableInput.value.length >= validatableInput.minLength;
  }
  if (validatableInput.maxLength != null && typeof validatableInput.value === 'string') {
    isValid = isValid && validatableInput.value.length <= validatableInput.maxLength;
  }
  if (validatableInput.min != null && typeof validatableInput.value === 'number') {
    isValid = isValid && validatableInput.value >= validatableInput.min;
  }
  if (validatableInput.max != null && typeof validatableInput.value === 'number') {
    isValid = isValid && validatableInput.value <= validatableInput.max;
  }

  return isValid;
}


// autobind decorator
function autobind(_target: any, _methodName: string, descriptor: PropertyDescriptor) {
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


// Component Base Class
abstract class Component<T extends HTMLElement, U extends HTMLElement> {
  templateElement: HTMLTemplateElement;
  hostElement: T;
  element: U;

  constructor(templateId: string, hostElementId: string, insertAtStart: boolean, newElementId?: string) {
    this.templateElement = document.getElementById(templateId) as HTMLTemplateElement;
    this.hostElement = document.getElementById(hostElementId) as T;

    const importedNode = document.importNode(this.templateElement.content, true);
    this.element = importedNode.firstElementChild as U;
    if (newElementId) {
      this.element.id = newElementId;
    }

    this.attach(insertAtStart);
  }

  private attach(insertAtBegin: boolean) {
    const insertPoint = insertAtBegin ? 'afterbegin' : 'beforeend';
    this.hostElement.insertAdjacentElement(insertPoint, this.element);
  }

  abstract configure(): void;
  abstract renderContent(): void;
}


// Project Input
class ProjectInput extends Component<HTMLDivElement, HTMLFormElement> {
  titleInputElement: HTMLInputElement;
  descriptionInputElement: HTMLInputElement;
  peopleInputElement: HTMLInputElement;

  constructor() {
    super('project-input', 'app', true, 'user-input');
    
    this.titleInputElement = this.element.querySelector('#title') as HTMLInputElement;
    this.descriptionInputElement = this.element.querySelector('#description') as HTMLInputElement;
    this.peopleInputElement = this.element.querySelector('#people') as HTMLInputElement;

    this.configure();
    this.renderContent();
  }

  configure() {
    this.element.addEventListener('submit', this.submitHandler);
  }

  renderContent() { }
  
  @autobind
  private submitHandler(ev: Event) {
    ev.preventDefault();
    console.log(this.titleInputElement.value);
    const userInput = this.gatherUserInput();
    if (Array.isArray(userInput)) {
      const [ title, desc, people ] = userInput; 
      projectState.addProject(title, desc, people);
      this.clearInputs();
    }
  }

  private clearInputs() {
    this.titleInputElement.value = '';
    this.descriptionInputElement.value = '';
    this.peopleInputElement.value = '' 
  }
  
  private gatherUserInput(): [string, string, number] | void {
    const enteredTitle = this.titleInputElement.value;
    const enteredDescription = this.descriptionInputElement.value;
    const enteredPeople = this.peopleInputElement.value;

    const titleValidatable: Validatable = {
      value: enteredTitle,
      required: true
    }

    const descValidatable: Validatable = {
      value: enteredDescription,
      required: true,
      minLength: 5
    }

    const peopleValidatable: Validatable = {
      value: +enteredPeople,
      required: true,
      min: 1,
      max: 5
    }

    if (
      !validate(titleValidatable)
      || !validate(descValidatable)
      || !validate(peopleValidatable)
    ) {
      alert('Invalid input, please try again!');
      return;
    } else {
      return [enteredTitle, enteredDescription, +enteredPeople];
    }
  }
}


// Project Item
class ProjectItem extends Component<HTMLUListElement, HTMLLIElement> {
  get persons(): string {
    return this.project.people === 1 ? '1 person' : `${this.project.people} persons`;
  }

  constructor(hostId: string, private project: Project) {
    super('single-project', hostId, false, project.id);

    this.configure();
    this.renderContent();
  }

  configure() {}

  renderContent() {
    this.element.querySelector('h2')!.textContent = this.project.title;
    this.element.querySelector('h3')!.textContent = `${this.persons} assigned`;
    this.element.querySelector('p')!.textContent = this.project.description;
  }
}


// Project List
class ProjectList extends Component<HTMLDivElement, HTMLElement> {
  private assignedProjects: Project[] = [];

  constructor(private type: 'active' | 'finished') {
    super('project-list', 'app', false, `${type}-projects`);

    this.configure();
    this.renderContent();
  }

  private renderProjects() {
    const listEl = document.getElementById(`${this.type}-project-list`) as HTMLUListElement;
    listEl.innerHTML = '';
    this.assignedProjects.forEach((project: any) => {
      new ProjectItem(this.element.querySelector('ul')!.id, project);
    });

  }

  configure() {
    projectState.addListener((projects: Project[]) => {
      const relavantProjects = projects.filter(prj => {
        if (this.type === 'active') {
          return prj.status === ProjectStatus.Active;
        }
        return prj.status === ProjectStatus.Finished;
      });
      this.assignedProjects = relavantProjects;
      this.renderProjects();
    });
  }

  renderContent() {
    const listId = `${this.type}-project-list`;
    this.element.querySelector('ul')!.id = listId;
    this.element.querySelector('h2')!.textContent = this.type.toUpperCase() + ' PROJECTS';
  }
}

// Instantiate instances
const projectInput = new ProjectInput();
const activeProjectList = new ProjectList('active');
const finishedProjectList = new ProjectList('finished');