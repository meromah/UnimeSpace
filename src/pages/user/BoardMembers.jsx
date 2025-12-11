import React, { useState, useRef, useEffect, useMemo } from "react";
import { useBlockUserFromWritingMutation, useGetBoardSubscribersPrivilegedQuery } from "../../services/boardSubscriptionsApi";
import { useParams, Link, useNavigate } from "react-router-dom";
import { HiDotsVertical } from "react-icons/hi";
import Loading from "../../components/Loading";
import ErrorDisplay from "../../components/ErrorDisplay";
import NotFound from "../../components/NotFound";
import { useSelector } from "react-redux";
import MemberCard from "./components/CommunityMember/MemberCard";
import BlockUserModal from "./components/CommunityMember/BlockUserModal";

const BoardMembers = () => {
  const { boardId } = useParams();
  const navigate = useNavigate();
  const { isAuthenticated } = useSelector((state) => state.auth);

  const [page, setPage] = useState(1);
  const [showBlockUserModal, setShowBlockUserModal] = useState(false);
  const [selectedMember, setSelectedMember] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);

  const { data, isLoading, isError, error } =
    useGetBoardSubscribersPrivilegedQuery({
      board: boardId,
      queryParams: {page},
    });
    const {members, blockedUsers, pagination} = useMemo(() => {
      const members = data?.data || []
      const pagination = {total: members.length || 0}
      const blockedUsers = new Set(data?.restricted || [])

      return {members, blockedUsers, pagination}
    }, [data])

  const [blockUser, {isLoading: isBlocking}] = useBlockUserFromWritingMutation()
  const handleSetBlock = (member) => {
    setSelectedMember(member);
    if(blockedUsers.has(member.id)){
      handleConfirmBlock(member)
      return
    }
    setShowBlockUserModal(true);
  };

  const handleConfirmBlock = async (member) => {
    setIsProcessing(true);
    try {
      await blockUser({ board: boardId, user: member.id }).unwrap();
      if (blockedUsers.has(member.id)) {
        blockedUsers.delete(member.id)
      } else{
        blockedUsers.add(member.id)
      }
      // Close modal after success
      setShowBlockUserModal(false);
      setSelectedMember(null);
    } catch (error) {
      console.error("Failed to set read-only:", error);
      // Handle error (could show toast notification)
    } finally {
      setIsProcessing(false);
    }
  };

  const handleCloseBlockUserModal = () => {
    if (!isProcessing) {
      setShowBlockUserModal(false);
      setSelectedMember(null);
    }
  };
  // Early authentication check - most critical
  if (isAuthenticated === false) {
    navigate("/login");
    return;
  }
  if (isLoading) return <Loading />;

  // Error handling
  if (isError) {
    const status = error?.status;
    // Handle specific error cases
    if (status === 404 || status === 403) {
      return <NotFound />;
    }
    return <ErrorDisplay error={error} />;
  }
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-2xl font-semibold text-gray-900">Members</h1>
          <p className="text-sm text-gray-500 mt-1">
            {pagination?.total || 0} total member
            {pagination?.total > 1 ? "s" : ""}
          </p>
        </div>

        {/* Members List */}
        {members.length > 0 ? (
          <div className="space-y-3">
            {members.map((subscriber) => (
              <MemberCard
                key={subscriber.id}
                subscriber={subscriber}
                onBlockUser={handleSetBlock}
                blockedUsers={blockedUsers}
              />
            ))}
          </div>
        ) : (
          <div className="bg-white rounded-lg border border-gray-200 p-12 text-center">
            <p className="text-gray-500 text-sm">No members yet</p>
          </div>
        )}

        {/* Pagination */}
        {pagination && pagination.last_page > 1 && (
          <div className="mt-6 flex items-center justify-between">
            <button
              onClick={() => setPage(page - 1)}
              disabled={page === 1}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition-all"
            >
              Previous
            </button>

            <span className="text-sm text-gray-600">
              Page {pagination.current_page} of {pagination.last_page}
            </span>

            <button
              onClick={() => setPage(page + 1)}
              disabled={page === pagination.last_page}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition-all"
            >
              Next
            </button>
          </div>
        )}
      </div>

      {/* Set Read-Only Modal */}
      <BlockUserModal
        isOpen={showBlockUserModal}
        onClose={handleCloseBlockUserModal}
        onConfirm={handleConfirmBlock}
        member={selectedMember}
        isProcessing={isProcessing}
      />
    </div>
  );
};

export default BoardMembers;
