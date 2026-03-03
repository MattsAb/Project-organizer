import type { User } from "./authTypes"
import type { MemberType } from "./projectTypes"

export type AssignmentStatus =
  | "TODO"
  | "IN_PROGRESS"
  | "DONE"

export type AssignmentType = {
    id: number
    projectId: number
    title: string
    description: string
    dueDate: string
    assignees: MemberType[]
    status: AssignmentStatus
}

export type SelectableMembers = {
  userId: number
  user: User
}