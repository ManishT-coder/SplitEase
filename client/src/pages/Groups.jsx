import { useState, useMemo } from "react";
import { FiPlus, FiSearch, FiUsers } from "react-icons/fi";
import { useGroups } from "../context/GroupContext";
import Modal from "../components/common/Modal";
import GroupForm from "../components/group/GroupForm";
import GroupCard from "../components/group/GroupCard";
import Loading from "../components/common/Loading";
import EmptyState from "../components/common/EmptyState";

const Groups = () => {
  const { groups, loading } = useGroups();
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const filteredGroups = useMemo(() => {
    if (!groups) return [];
    const query = searchQuery.toLowerCase().trim();
    if (!query) return groups;
    return groups.filter((g) => g.name.toLowerCase().includes(query));
  }, [groups, searchQuery]);

  if (loading) return <Loading />;

  return (
    <div>
      {/* Header */}
      <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-3">
            <FiUsers className="text-brand-600 text-2xl" />
            <h1 className="text-3xl font-bold text-gray-900">My Groups</h1>
          </div>
          <button
            onClick={() => setIsCreateOpen(true)}
            className="inline-flex items-center gap-2 px-5 py-2.5 bg-brand-600 text-white font-semibold rounded-lg hover:bg-brand-700 transition-colors shadow-sm"
          >
            <FiPlus className="text-lg" />
            Create Group
          </button>
        </div>

        {/* Search Bar */}
        {groups && groups.length > 0 && (
          <div className="relative mb-6 max-w-md">
            <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-lg" />
            <input
              type="text"
              placeholder="Search groups by name..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-3 bg-white border border-gray-200 rounded-lg text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-brand-600 focus:border-transparent transition-shadow"
            />
          </div>
        )}

        {/* Content */}
        {!groups || groups.length === 0 ? (
          <EmptyState
            icon={<FiUsers className="text-5xl" />}
            title="No groups yet"
            description="Create your first group to start splitting expenses with friends."
            action={
              <button
                onClick={() => setIsCreateOpen(true)}
                className="mt-4 inline-flex items-center gap-2 px-5 py-2.5 bg-brand-600 text-white font-semibold rounded-lg hover:bg-brand-700 transition-colors"
              >
                <FiPlus className="text-lg" />
                Create a Group
              </button>
            }
          />
        ) : filteredGroups.length === 0 ? (
          <EmptyState
            icon={<FiSearch className="text-5xl" />}
            title="No groups found"
            description={`No groups match "${searchQuery}". Try a different search term.`}
          />
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredGroups.map((group) => (
              <GroupCard key={group._id} group={group} />
            ))}
          </div>
        )}

      {/* Create Group Modal */}
      <Modal
        open={isCreateOpen}
        onClose={() => setIsCreateOpen(false)}
        title="Create New Group"
      >
        <GroupForm
          onCreated={() => setIsCreateOpen(false)}
          onClose={() => setIsCreateOpen(false)}
        />
      </Modal>
    </div>
  );
};

export default Groups;
