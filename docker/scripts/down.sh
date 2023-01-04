# Позволяет указывать конкретные контейнеры
CONTAINER_NAMES="$@"

if [ -z ${CONTAINER_NAMES} ]; then
    CONTAINER_NAMES="postgres redis"
fi

for CONTAINER_NAME in ${CONTAINER_NAMES}; do
    echo "Удаление контейнера '${CONTAINER_NAME}' ..."
    docker stop "mira-${CONTAINER_NAME}"
    docker rm "mira-${CONTAINER_NAME}"
done

echo "--- OK ---"
