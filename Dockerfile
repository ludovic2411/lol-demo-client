# Node.js 26 base image (slim variant, recommended by the Node documentation for the "current" version)
FROM node:26-slim

# Creating a non-root user dedicated to the application
# (the slim image is based on Debian, so we use groupadd/useradd)
RUN groupadd --system appuser \
    && useradd --system --gid appuser --create-home --shell /bin/bash appuser

# Working directory in the container, owned directly by appuser
# (empty folder at this stage -> chown is almost instant, unlike a chown
# after COPY + npm install which would have to go through all of node_modules)
WORKDIR /app
RUN chown appuser:appuser /app

# Install Angular CLI globally (root required to write in /usr)
RUN npm install -g @angular/cli

# Switch to non-root user BEFORE installing project dependencies:
#  so node_modules is created with right owners directly,
# no need of a costly chown -R after that
USER appuser

# Copy dependencies folders first (better Docker cache usage),
# with --chown so copied files belong to appuser since copy
COPY --chown=appuser:appuser package.json package-lock.json ./

# Install project dependencies as appuser
RUN npm install

# Copy the rest of the source code as appuser
COPY --chown=appuser:appuser . .

# Export used port by ng serve command
EXPOSE 3000

# Start the development server
# --host 0.0.0.0 is required to make the server accessible from the outside of the container
# (by default, ng listen on localhost only)
CMD ["ng", "serve", "--host", "0.0.0.0", "--port", "3000"]
