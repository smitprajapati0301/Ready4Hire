const getCurrentHost = () => {
    if (typeof window === "undefined") {
        return "this domain";
    }

    return window.location.hostname || window.location.host || "this domain";
};

export function isUserProfileMissingError(error) {
    return error?.response?.status === 404;
}

export function getUserProfileErrorMessage(error) {
    const status = error?.response?.status;

    if (status === 404) {
        return "No profile found for this account. Please sign up to finish setup.";
    }

    if (status === 401 || status === 403) {
        return "Your session could not be verified. Please sign in again.";
    }

    return "We couldn't load your account right now. Check the backend connection and try again.";
}

export function getGoogleAuthErrorMessage(error, actionLabel) {
    switch (error?.code) {
        case "auth/popup-closed-by-user":
            return `${actionLabel} cancelled. Please try again.`;
        case "auth/popup-blocked":
            return "Popup blocked. Please allow popups and try again.";
        case "auth/unauthorized-domain":
            return `Google Sign-In is not enabled for ${getCurrentHost()}. Add that domain in Firebase Console > Authentication > Settings > Authorized domains.`;
        default:
            return null;
    }
}