import type { User } from "./authTypes"
import type { Member } from "./projectTypes"

type AssignmentStatus =
  | "TODO"
  | "IN_PROGRESS"
  | "DONE"

export type AssignmentType = {
    id: number
    projectId: number
    title: string
    description: string
    dueDate: string
    assignees: Member[]
    status: AssignmentStatus
}

export type SelectableMembers = {
  userId: number
  user: User
}