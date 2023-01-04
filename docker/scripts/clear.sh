GROUP_NAME="mira-bot"

# Позволяет указывать конкретные контейнеры
CONTAINER_NAMES="$@"

if [ -z ${CONTAINER_NAMES} ]; then
    CONTAINER_NAMES="postgres redis"
fi

for CONTAINER_NAME in ${CONTAINER_NAMES}; do
    echo "Удаление данных контейнера '${CONTAINER_NAME}' в группе '${GROUP_NAME}' ..."
    docker volume rm "${GROUP_NAME}_${CONTAINER_NAME}_data"
done

echo "--- OK ---"
