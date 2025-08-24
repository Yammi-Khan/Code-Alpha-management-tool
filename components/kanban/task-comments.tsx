"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { useAuth } from "@/contexts/auth-context"
import { Send, Reply, Edit2, Trash2, MoreHorizontal, Heart, MessageSquare } from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { formatDistanceToNow } from "date-fns"

interface Comment {
  id: string
  content: string
  author: {
    id: string
    name: string
    avatar?: string
  }
  createdAt: string
  updatedAt?: string
  replies: Comment[]
  likes: number
  isLiked: boolean
}

interface TaskCommentsProps {
  taskId: string
  comments: Comment[]
  onAddComment: (taskId: string, content: string, parentId?: string) => void
  onUpdateComment: (commentId: string, content: string) => void
  onDeleteComment: (commentId: string) => void
  onLikeComment: (commentId: string) => void
}

export function TaskComments({
  taskId,
  comments,
  onAddComment,
  onUpdateComment,
  onDeleteComment,
  onLikeComment,
}: TaskCommentsProps) {
  const { user } = useAuth()
  const [newComment, setNewComment] = useState("")
  const [replyingTo, setReplyingTo] = useState<string | null>(null)
  const [replyContent, setReplyContent] = useState("")
  const [editingComment, setEditingComment] = useState<string | null>(null)
  const [editContent, setEditContent] = useState("")

  const handleAddComment = () => {
    if (newComment.trim()) {
      onAddComment(taskId, newComment.trim())
      setNewComment("")
    }
  }

  const handleAddReply = (parentId: string) => {
    if (replyContent.trim()) {
      onAddComment(taskId, replyContent.trim(), parentId)
      setReplyContent("")
      setReplyingTo(null)
    }
  }

  const handleEditComment = (commentId: string, currentContent: string) => {
    setEditingComment(commentId)
    setEditContent(currentContent)
  }

  const handleSaveEdit = (commentId: string) => {
    if (editContent.trim()) {
      onUpdateComment(commentId, editContent.trim())
      setEditingComment(null)
      setEditContent("")
    }
  }

  const handleCancelEdit = () => {
    setEditingComment(null)
    setEditContent("")
  }

  const CommentItem = ({ comment, isReply = false }: { comment: Comment; isReply?: boolean }) => {
    const isAuthor = user?.id === comment.author.id
    const isEditing = editingComment === comment.id

    return (
      <div className={`${isReply ? "ml-8 mt-2" : ""}`}>
        <Card className="border-l-2 border-l-primary/20">
          <CardContent className="p-4">
            <div className="flex items-start space-x-3">
              <Avatar className="h-8 w-8">
                <AvatarImage src={comment.author.avatar || "/placeholder.svg"} alt={comment.author.name} />
                <AvatarFallback className="text-xs">
                  {comment.author.name
                    .split(" ")
                    .map((n) => n[0])
                    .join("")}
                </AvatarFallback>
              </Avatar>

              <div className="flex-1 space-y-2">
                {/* Comment Header */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <span className="font-medium text-sm">{comment.author.name}</span>
                    <span className="text-xs text-muted-foreground">
                      {formatDistanceToNow(new Date(comment.createdAt), { addSuffix: true })}
                    </span>
                    {comment.updatedAt && comment.updatedAt !== comment.createdAt && (
                      <Badge variant="secondary" className="text-xs">
                        edited
                      </Badge>
                    )}
                  </div>

                  {/* Comment Actions */}
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="sm" className="h-6 w-6 p-0">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      {!isReply && (
                        <DropdownMenuItem onClick={() => setReplyingTo(comment.id)}>
                          <Reply className="mr-2 h-4 w-4" />
                          Reply
                        </DropdownMenuItem>
                      )}
                      {isAuthor && (
                        <>
                          <DropdownMenuItem onClick={() => handleEditComment(comment.id, comment.content)}>
                            <Edit2 className="mr-2 h-4 w-4" />
                            Edit
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem onClick={() => onDeleteComment(comment.id)} className="text-destructive">
                            <Trash2 className="mr-2 h-4 w-4" />
                            Delete
                          </DropdownMenuItem>
                        </>
                      )}
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>

                {/* Comment Content */}
                {isEditing ? (
                  <div className="space-y-2">
                    <Textarea
                      value={editContent}
                      onChange={(e) => setEditContent(e.target.value)}
                      className="min-h-[60px]"
                      placeholder="Edit your comment..."
                    />
                    <div className="flex items-center space-x-2">
                      <Button size="sm" onClick={() => handleSaveEdit(comment.id)}>
                        Save
                      </Button>
                      <Button size="sm" variant="outline" onClick={handleCancelEdit}>
                        Cancel
                      </Button>
                    </div>
                  </div>
                ) : (
                  <p className="text-sm text-foreground whitespace-pre-wrap">{comment.content}</p>
                )}

                {/* Comment Actions Bar */}
                {!isEditing && (
                  <div className="flex items-center space-x-4 pt-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => onLikeComment(comment.id)}
                      className={`h-6 px-2 ${comment.isLiked ? "text-red-500" : "text-muted-foreground"}`}
                    >
                      <Heart className={`h-3 w-3 mr-1 ${comment.isLiked ? "fill-current" : ""}`} />
                      {comment.likes > 0 && <span className="text-xs">{comment.likes}</span>}
                    </Button>

                    {!isReply && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setReplyingTo(comment.id)}
                        className="h-6 px-2 text-muted-foreground"
                      >
                        <MessageSquare className="h-3 w-3 mr-1" />
                        <span className="text-xs">Reply</span>
                      </Button>
                    )}
                  </div>
                )}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Reply Form */}
        {replyingTo === comment.id && (
          <div className="ml-8 mt-2">
            <Card className="border-dashed">
              <CardContent className="p-3">
                <div className="flex items-start space-x-2">
                  <Avatar className="h-6 w-6">
                    <AvatarImage src={user?.avatar || "/placeholder.svg"} alt={user?.name || ""} />
                    <AvatarFallback className="text-xs">
                      {user?.name
                        ?.split(" ")
                        .map((n) => n[0])
                        .join("") || "U"}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1 space-y-2">
                    <Textarea
                      value={replyContent}
                      onChange={(e) => setReplyContent(e.target.value)}
                      placeholder={`Reply to ${comment.author.name}...`}
                      className="min-h-[60px] text-sm"
                    />
                    <div className="flex items-center space-x-2">
                      <Button size="sm" onClick={() => handleAddReply(comment.id)} disabled={!replyContent.trim()}>
                        <Send className="h-3 w-3 mr-1" />
                        Reply
                      </Button>
                      <Button size="sm" variant="outline" onClick={() => setReplyingTo(null)}>
                        Cancel
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Replies */}
        {comment.replies && comment.replies.length > 0 && (
          <div className="mt-2 space-y-2">
            {comment.replies.map((reply) => (
              <CommentItem key={reply.id} comment={reply} isReply={true} />
            ))}
          </div>
        )}
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {/* Comments Header */}
      <div className="flex items-center space-x-2">
        <MessageSquare className="h-4 w-4 text-muted-foreground" />
        <span className="font-medium text-sm">
          Comments ({comments.reduce((total, comment) => total + 1 + comment.replies.length, 0)})
        </span>
      </div>

      <Separator />

      {/* Add New Comment */}
      <Card className="border-dashed">
        <CardContent className="p-4">
          <div className="flex items-start space-x-3">
            <Avatar className="h-8 w-8">
              <AvatarImage src={user?.avatar || "/placeholder.svg"} alt={user?.name || ""} />
              <AvatarFallback className="text-xs">
                {user?.name
                  ?.split(" ")
                  .map((n) => n[0])
                  .join("") || "U"}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1 space-y-3">
              <Textarea
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                placeholder="Add a comment..."
                className="min-h-[80px]"
              />
              <div className="flex items-center justify-between">
                <span className="text-xs text-muted-foreground">Tip: Use @username to mention team members</span>
                <Button onClick={handleAddComment} disabled={!newComment.trim()}>
                  <Send className="h-4 w-4 mr-2" />
                  Comment
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Comments List */}
      <div className="space-y-4">
        {comments.length === 0 ? (
          <div className="text-center py-8">
            <MessageSquare className="h-12 w-12 text-muted-foreground mx-auto mb-2" />
            <p className="text-sm text-muted-foreground">No comments yet. Be the first to comment!</p>
          </div>
        ) : (
          comments.map((comment) => <CommentItem key={comment.id} comment={comment} />)
        )}
      </div>
    </div>
  )
}
