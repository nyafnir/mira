CONTAINER_NAME_PREFIX="mira-"
# Позволяет указывать конкретные контейнеры
CONTAINER_NAMES="$@"

if [ -z ${CONTAINER_NAMES} ]; then
    CONTAINER_NAMES="postgres redis"
fi

for CONTAINER_NAME in ${CONTAINER_NAMES}; do
    echo "Перезапуск контейнера '${CONTAINER_NAME}' ..."
    docker restart "mira-${CONTAINER_NAME}"
done

echo "--- OK ---"
