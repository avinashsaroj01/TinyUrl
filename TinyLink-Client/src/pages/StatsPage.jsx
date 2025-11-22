import React, { useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  getLinkStats,
  selectCurrentLinkStats,
  selectStatsStatus,
  selectStatsError,
  clearCurrentLinkStats,
} from "../features/links/linksSlice";
import StatCard from "../components/StatCard";

const StatsPage = () => {
  const { code } = useParams();
  const dispatch = useDispatch();
  const stats = useSelector(selectCurrentLinkStats);
  const status = useSelector(selectStatsStatus);
  const error = useSelector(selectStatsError);

  useEffect(() => {
    // Fetch statistics when the component mounts or the code changes
    if (code) {
      dispatch(getLinkStats(code));
    }
    // Cleanup state when component unmounts
    return () => {
      dispatch(clearCurrentLinkStats());
    };
  }, [code, dispatch]);

  const formatDate = (isoString) => {
    if (!isoString) return "N/A";
    const date = new Date(isoString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
    });
  };

  const renderContent = () => {
    if (status === "loading") {
      return (
        <div className="text-center py-20">
          <svg
            className="animate-spin h-8 w-8 text-indigo-500 mx-auto"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            ></circle>
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            ></path>
          </svg>
          <p className="mt-4 text-gray-500">
            Fetching statistics for:{" "}
            <span className="font-mono font-semibold text-indigo-600">
              {code}
            </span>
          </p>
        </div>
      );
    }

    if (status === "failed" || error) {
      return (
        <div className="p-8 bg-red-50 border border-red-300 rounded-xl text-center shadow-lg">
          <h2 className="text-2xl font-bold text-red-700">
            Error Loading Stats
          </h2>
          <p className="mt-2 text-red-600">
            {error ||
              "The requested link statistics could not be found or an error occurred."}
          </p>
          <Link
            to="/"
            className="mt-4 inline-block text-indigo-600 hover:text-indigo-800 font-medium transition duration-150"
          >
            &larr; Back to Dashboard
          </Link>
        </div>
      );
    }

    if (stats) {
      const shortUrl = `${window.location.origin}/${stats.code}`;
      return (
        <div className="space-y-8">
          <div className="bg-white p-6 rounded-xl shadow-xl border border-gray-100">
            <h2 className="text-2xl font-bold text-gray-800 mb-2">
              Code Details:{" "}
              <span className="font-mono text-indigo-600">{stats.code}</span>
            </h2>
            <p className="text-sm text-gray-500 mb-4">
              Short URL:
              <a
                href={shortUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="font-medium text-blue-600 hover:text-blue-800 ml-2"
              >
                {shortUrl}
              </a>
            </p>
            <p className="text-lg text-gray-700 break-all">
              <span className="font-semibold text-gray-600">Target:</span>{" "}
              {stats.targetUrl}
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <StatCard
              title="Total Clicks"
              value={stats.totalClicks || 0}
              description="Lifetime count of all redirects."
            />
            <StatCard
              title="Date Created"
              value={formatDate(stats.createdAt)}
              description="The date this TinyLink was first created."
            />
            <StatCard
              title="Last Clicked"
              value={formatDate(stats.lastClickedTime)}
              description="The most recent timestamp a user visited the short link."
            />
            <StatCard
              title="Status"
              value="Active"
              description="The link is currently active and redirecting."
            />
          </div>

          <Link
            to="/"
            className="mt-8 inline-flex items-center text-indigo-600 hover:text-indigo-800 font-medium transition duration-150"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5 mr-1"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z"
                clipRule="evenodd"
              />
            </svg>
            Back to Dashboard
          </Link>
        </div>
      );
    }
  };

  return (
    <div>
      <h1 className="text-3xl font-bold text-gray-900 mb-6">Link Statistics</h1>
      {renderContent()}
    </div>
  );
};

export default StatsPage;
