import React, { useEffect, useState, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import {
  fetchLinks,
  deleteLink,
  selectAllLinks,
  selectLinksStatus,
  selectLinksError,
  setNotification,
} from "../features/links/linksSlice";

const LinkTable = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const links = useSelector(selectAllLinks);
  const status = useSelector(selectLinksStatus);
  const error = useSelector(selectLinksError);

  const [searchTerm, setSearchTerm] = useState("");
  const [sortConfig, setSortConfig] = useState({
    key: "lastClickedTime",
    direction: "descending",
  });

  useEffect(() => {
    // Fetch links only once when the component mounts
    if (status === "idle") {
      dispatch(fetchLinks());
    }
  }, [status, dispatch]);

  const handleCopy = (code) => {
    const fullUrl = `${window.location.origin}/${code}`;
    // Use document.execCommand('copy') for better compatibility in sandboxed environments
    const tempInput = document.createElement("input");
    document.body.appendChild(tempInput);
    tempInput.value = fullUrl;
    tempInput.select();
    try {
      document.execCommand("copy");
      dispatch(
        setNotification({
          message: `Copied ${code} to clipboard!`,
          type: "success",
        })
      );
    } catch (err) {
      dispatch(
        setNotification({ message: "Failed to copy URL.", type: "error" })
      );
    } finally {
      document.body.removeChild(tempInput);
    }
  };

  const handleDelete = (code) => {
    if (
      window.confirm(
        `Are you sure you want to delete the link with code: ${code}?`
      )
    ) {
      dispatch(deleteLink(code));
    }
  };

  const requestSort = (key) => {
    let direction = "ascending";
    if (sortConfig.key === key && sortConfig.direction === "ascending") {
      direction = "descending";
    }
    setSortConfig({ key, direction });
  };

  const sortedLinks = useMemo(() => {
    let sortableItems = [...links];
    if (sortConfig !== null) {
      sortableItems.sort((a, b) => {
        const aValue = a[sortConfig.key];
        const bValue = b[sortConfig.key];

        if (aValue === null)
          return sortConfig.direction === "ascending" ? 1 : -1;
        if (bValue === null)
          return sortConfig.direction === "ascending" ? -1 : 1;

        if (aValue < bValue) {
          return sortConfig.direction === "ascending" ? -1 : 1;
        }
        if (aValue > bValue) {
          return sortConfig.direction === "ascending" ? 1 : -1;
        }
        return 0;
      });
    }
    return sortableItems;
  }, [links, sortConfig]);

  const filteredLinks = sortedLinks.filter(
    (link) =>
      link.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
      link.targetUrl.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const formatDate = (isoString) => {
    if (!isoString) return "N/A";
    const date = new Date(isoString);
    return date.toLocaleDateString() + " " + date.toLocaleTimeString();
  };

  const getSortIcon = (key) => {
    if (sortConfig.key !== key) {
      return null;
    }
    return sortConfig.direction === "ascending" ? " ▲" : " ▼";
  };

  if (status === "loading") {
    return (
      <div className="text-center py-10 text-gray-500">Loading links...</div>
    );
  }

  if (status === "failed" && error) {
    return (
      <div className="p-4 bg-red-100 text-red-700 rounded-lg shadow-sm">
        Error: {error}
      </div>
    );
  }

  return (
    <div className="mt-10 bg-white p-6 rounded-xl shadow-xl border border-gray-100">
      <h2 className="text-2xl font-semibold text-gray-800 mb-4">
        Link Dashboard
      </h2>

      {/* Search Bar */}
      <div className="mb-4">
        <input
          type="text"
          placeholder="Search by code or target URL..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full p-3 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500"
        />
      </div>

      {/* Empty State */}
      {filteredLinks.length === 0 && (
        <div className="text-center py-10 text-gray-500 bg-gray-50 rounded-lg">
          {links.length === 0
            ? "No links created yet. Use the form above to get started!"
            : "No results found matching your search term."}
        </div>
      )}

      {/* Table */}
      {filteredLinks.length > 0 && (
        <div className="overflow-x-auto shadow-sm ring-1 ring-black ring-opacity-5 rounded-lg">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100 transition duration-150"
                  onClick={() => requestSort("code")}
                >
                  Short Code {getSortIcon("code")}
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Target URL
                </th>
                <th
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100 transition duration-150"
                  onClick={() => requestSort("totalClicks")}
                >
                  Clicks {getSortIcon("totalClicks")}
                </th>
                <th
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100 transition duration-150"
                  onClick={() => requestSort("lastClickedTime")}
                >
                  Last Clicked {getSortIcon("lastClickedTime")}
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredLinks.map((link) => (
                <tr key={link.code} className="hover:bg-gray-50">
                  {/* Short Code */}
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-indigo-600">
                    <a
                      href={`/${link.code}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="hover:underline"
                    >
                      {link.code}
                    </a>
                  </td>

                  {/* Target URL (Truncated) */}
                  <td className="px-6 py-4 max-w-xs text-sm text-gray-500">
                    <p className="truncate" title={link.targetUrl}>
                      {link.targetUrl}
                    </p>
                  </td>

                  {/* Total Clicks */}
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700 font-semibold">
                    {link.totalClicks || 0}
                  </td>

                  {/* Last Clicked */}
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {formatDate(link.lastClickedTime)}
                  </td>

                  {/* Actions */}
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium space-x-2">
                    <button
                      onClick={() => navigate(`/code/${link.code}`)}
                      className="text-blue-600 hover:text-blue-900 transition duration-150 hover:underline"
                      title="View Statistics"
                    >
                      Stats
                    </button>
                    <button
                      onClick={() => handleCopy(link.code)}
                      className="text-green-600 hover:text-green-900 transition duration-150 hover:underline"
                      title="Copy Short URL"
                    >
                      Copy
                    </button>
                    <button
                      onClick={() => handleDelete(link.code)}
                      className="text-red-600 hover:text-red-900 transition duration-150 hover:underline"
                      title="Delete Link"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default LinkTable;
