// Export all services from this file for easier imports
export {
  getTodos,
  createTodo,
  updateTodo,
  deleteTodo,
  toggleTodoStatus,
  type Todo,
  type CreateTodoData,
  type UpdateTodoData,
} from "./todos.service"

export {
  getGoals,
  createGoal,
  updateGoal,
  deleteGoal,
  type Goal,
  type CreateGoalData,
  type UpdateGoalData,
} from "./goals.service"

// Future services can be added here:
// export { goalsService } from './goals.service'
// export { habitsService } from './habits.service'
// export { journalsService } from './journals.service'
// export { notesService } from './notes.service'
