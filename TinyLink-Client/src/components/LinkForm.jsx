import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  createNewLink,
  clearNotification,
  selectNotification,
  setNotification,
} from "../features/links/linksSlice";

const LinkForm = () => {
  const [targetUrl, setTargetUrl] = useState("");
  const [customCode, setCustomCode] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const dispatch = useDispatch();
  const notification = useSelector(selectNotification);

  // Regex for validation: [A-Za-z0-9]{6,8}
  const CODE_REGEX = /^[A-Za-z0-9]{6,8}$/;

  // Basic URL validation pattern
  const URL_REGEX =
    /^https?:\/\/(?:www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b(?:[-a-zA-Z0-9()@:%_\+.~#?&//=]*)$/;

  useEffect(() => {
    if (notification) {
      const timer = setTimeout(() => {
        dispatch(clearNotification());
      }, 5000); // Clear notification after 5 seconds
      return () => clearTimeout(timer);
    }
  }, [notification, dispatch]);

  const validateInputs = () => {
    let isValid = true;

    // 1. Target URL check (Mandatory)
    if (!URL_REGEX.test(targetUrl)) {
      dispatch(
        setNotification({
          message:
            "Please enter a valid target URL (starting with http/https).",
          type: "error",
        })
      );
      isValid = false;
    }

    // 2. Custom Code check (Optional, but if present, must match regex)
    else if (customCode && !CODE_REGEX.test(customCode)) {
      dispatch(
        setNotification({
          message:
            "Custom code must be 6-8 alphanumeric characters (A-Z, a-z, 0-9).",
          type: "error",
        })
      );
      isValid = false;
    }

    return isValid;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (isSubmitting || !validateInputs()) {
      return;
    }

    setIsSubmitting(true);
    dispatch(clearNotification()); // Clear previous errors/successes

    // Only pass customCode if it's not empty, otherwise let the backend generate one
    const payload = {
      targetUrl,
      customCode: customCode.trim() || undefined,
    };

    try {
      // unwrapResult is used to handle the rejected (error) state of the thunk
      await dispatch(createNewLink(payload)).unwrap();

      // On success: Clear form inputs, notification is handled by the slice
      setTargetUrl("");
      setCustomCode("");
    } catch (error) {
      // The error is already handled and set as a notification/error in the linksSlice.extraReducers
      console.error("Link creation failed:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="mb-8 p-6 bg-white shadow-xl rounded-xl border border-gray-100">
      <h2 className="text-2xl font-semibold text-gray-800 mb-6">
        Create New TinyLink
      </h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* URL Input */}
        <div>
          <label
            htmlFor="targetUrl"
            className="block text-sm font-medium text-gray-700"
          >
            Target URL (Required)
          </label>
          <input
            type="url"
            id="targetUrl"
            value={targetUrl}
            onChange={(e) => setTargetUrl(e.target.value)}
            placeholder="e.g., https://very.long.website/page"
            className="mt-1 block w-full rounded-md border border-gray-300 shadow-sm p-3 focus:ring-indigo-500 focus:border-indigo-500 transition duration-150"
            required
            aria-describedby="url-validation"
          />
        </div>

        {/* Custom Code Input */}
        <div>
          <label
            htmlFor="customCode"
            className="block text-sm font-medium text-gray-700"
          >
            Custom Code (Optional, 6-8 alphanumeric)
          </label>
          <input
            type="text"
            id="customCode"
            value={customCode}
            onChange={(e) => setCustomCode(e.target.value)}
            placeholder="e.g., mydocs (6-8 chars)"
            className="mt-1 block w-full rounded-md border border-gray-300 shadow-sm p-3 focus:ring-indigo-500 focus:border-indigo-500 transition duration-150"
            maxLength={8}
            aria-describedby="code-validation"
          />
        </div>

        {/* Notification/Error Area */}
        {notification && (
          <div
            className={`p-3 rounded-lg text-sm font-medium ${
              notification.type === "success"
                ? "bg-green-100 text-green-800 border border-green-300"
                : "bg-red-100 text-red-800 border border-red-300"
            }`}
            role="alert"
          >
            {notification.message}
          </div>
        )}

        {/* Submit Button */}
        <button
          type="submit"
          disabled={isSubmitting || !targetUrl.trim()}
          className={`w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-base font-medium text-white transition duration-200 ${
            isSubmitting || !targetUrl.trim()
              ? "bg-indigo-300 cursor-not-allowed"
              : "bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transform hover:scale-[1.005]"
          }`}
        >
          {isSubmitting ? (
            <>
              <svg
                className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
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
              Shortening...
            </>
          ) : (
            "Shorten URL"
          )}
        </button>
      </form>
    </div>
  );
};

export default LinkForm;
