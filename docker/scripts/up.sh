SCRIPT_PATH_FILE=$(dirname "$0")
SCRIPT_PATH_FOLDER=$(realpath "$SCRIPT_PATH_FILE")

GROUP_NAME="mira-bot"

# Позволяет указывать конкретные контейнеры
CONTAINER_NAMES="$@"

if [ -z ${CONTAINER_NAMES} ]; then
    CONTAINER_NAMES="postgres redis"
fi

for CONTAINER_NAME in ${CONTAINER_NAMES}; do
    FOLDER="${SCRIPT_PATH_FOLDER}/../${CONTAINER_NAME}"

    if [ ! -d ${FOLDER} ]; then
        echo "Каталога '${FOLDER}' не существует!"
        exit 1
    fi

    if [ ! -e "${FOLDER}/.env" ]; then
        echo "Копирование файла настроек ..."
        cp ${FOLDER}/.env.example ${FOLDER}/.env
    fi

    echo "Добавление контейнера '${CONTAINER_NAME}' в группу '${GROUP_NAME}' ..."
    # COMPOSE_IGNORE_ORPHANS - игнорируем факт того что группа уже существует
    COMPOSE_IGNORE_ORPHANS=1 docker-compose \
        -p ${GROUP_NAME} \
        --env-file ${FOLDER}/.env \
        --file "${FOLDER}/docker-compose.yml" \
        up --build --detach
done

echo "--- OK ---"
